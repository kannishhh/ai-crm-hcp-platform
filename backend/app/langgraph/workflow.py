from typing import Annotated, List, Dict, Any, Union
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, ToolMessage
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from app.services.groq_service import llm
from app.tools.log_interaction import log_interaction_tool
from app.tools.edit_interaction_tool import edit_interaction_tool
from app.tools.followup_recommendation_tool import followup_recommendation_tool
from app.tools.compliance_analysis_tool import compliance_analysis_tool
from app.tools.hcp_insight_tool import hcp_insight_tool
from app.tools.clinical_intelligence_tool import extract_clinical_intelligence
import json
import uuid


class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], lambda x, y: x + y]
    next_node: str
    structured_data: Dict[str, Any]
    final_response: Dict[str, Any]


tools = [
    log_interaction_tool,
    edit_interaction_tool,
    followup_recommendation_tool,
    compliance_analysis_tool,
    hcp_insight_tool,
    extract_clinical_intelligence,
]

tool_node = ToolNode(tools)


async def supervisor_agent(state: AgentState):
    """
    Supervisor that decides which tool(s) to call and provides the necessary arguments.
    Supports multiple parallel tool calls for complex requests.
    """
    last_message = state["messages"][-1].content

    prompt = f"""
    You are the Genie CRM Supervisor. You manage specialized AI tools for pharma CRM.
    
    Tools:
    1. extract_clinical_intelligence: Analyzes text and extracts ALL clinical data points. Use for any new interaction notes or narratives.
    2. edit_interaction_tool: Updates existing interactions based on user requests (e.g., "Change sentiment to Positive").
    3. followup_recommendation_tool: Generates detailed, strategic follow-up plans.
    4. compliance_analysis_tool: Performs deep regulatory and compliance audits.
    5. hcp_insight_tool: Calculates behavioral, engagement, and prescribing scores.

    User Request:
    "{last_message}"

    Decide which tool(s) to call. 
    - If the user provides a detailed narrative, use 'extract_clinical_intelligence'.
    - If the user asks for edits, use 'edit_interaction_tool'.
    - If the user asks for a deep compliance audit AND HCP insights, you may call BOTH tools.
    - If the user asks for follow-up recommendations specifically, use 'followup_recommendation_tool'.
    
    Return a JSON object with a list of tool calls:
    {{
        "calls": [
            {{ "tool": "tool_name", "args": {{ "arg_name": "arg_value" }} }},
            ...
        ]
    }}
    
    Return ONLY raw JSON.
    """

    try:
        response = await llm.ainvoke(prompt)
        content = response.content.strip()
        print(f"DEBUG: Supervisor Raw Response: {content}")

        json_str = content
        if "```json" in content:
            json_str = content.split("```json")[1].split("```")[0].strip()
        elif "{" in content:
            start = content.find("{")
            end = content.rfind("}") + 1
            json_str = content[start:end]

        try:
            parsed = json.loads(json_str)
            calls = parsed.get("calls", [])
            if not calls and "tool" in parsed:
                calls = [parsed]
        except:
            if len(last_message) > 100:
                calls = [
                    {
                        "tool": "extract_clinical_intelligence",
                        "args": {"text": last_message},
                    }
                ]
            else:
                raise

        tool_calls = []
        for call in calls:
            tool_name = call.get("tool")
            args = call.get("args", {})

            if tool_name == "extract_clinical_intelligence" and "text" not in args:
                args["text"] = last_message
            if (
                tool_name
                in [
                    "followup_recommendation_tool",
                    "compliance_analysis_tool",
                    "hcp_insight_tool",
                ]
                and "interaction_data" not in args
                and "interaction_context" not in args
            ):
                arg_name = (
                    "interaction_data"
                    if tool_name == "followup_recommendation_tool"
                    else "interaction_context"
                )
                args[arg_name] = last_message

            if tool_name and any(t.name == tool_name for t in tools):
                tool_calls.append(
                    {"name": tool_name, "args": args, "id": str(uuid.uuid4())}
                )

        if tool_calls:
            print(
                f"DEBUG: Supervisor Decided Tools: {[tc['name'] for tc in tool_calls]}"
            )
            return {
                "messages": [AIMessage(content="", tool_calls=tool_calls)],
                "next_node": "tools",
            }

        print("DEBUG: No valid tool found, heading to responder.")
        return {"next_node": "responder"}
    except Exception as e:
        print(f"DEBUG: Supervisor Error: {e}")
        if len(last_message) > 100:
            return {
                "messages": [
                    AIMessage(
                        content="",
                        tool_calls=[
                            {
                                "name": "extract_clinical_intelligence",
                                "args": {"text": last_message},
                                "id": str(uuid.uuid4()),
                            }
                        ],
                    )
                ],
                "next_node": "tools",
            }
        return {"next_node": "responder"}


async def responder_node(state: AgentState):
    """
    Formats the final response for the user, combining tool outputs and conversational context.
    """
    messages = state["messages"]
    tool_messages = [m for m in messages if isinstance(m, ToolMessage)]

    print(f"DEBUG: Found {len(tool_messages)} tool messages.")

    combined_results = {}
    for tm in tool_messages:
        try:
            content = tm.content
            if isinstance(content, str):
                try:
                    data = json.loads(content)
                except:
                    data = {"raw": content}
            else:
                data = content

            if isinstance(data, dict):
                combined_results.update(data)
        except:
            pass

    prompt = f"""
    You are Genie, the Pharma AI Copilot. Summarize the results of the analysis.
    Be professional, clinical, and helpful.
    
    Combined Analysis Data: {json.dumps(combined_results)}
    
    Summarize the key findings from all tools used (Extraction, Compliance, Insights, Follow-ups).
    If it was an update, confirm the changes.
    
    Generate a natural language response for the chat window.
    """

    response = await llm.ainvoke(prompt)

    return {
        "final_response": {
            "answer": response.content,
            "data": combined_results,
            "type": "analysis_result" if combined_results else "chat_response",
        }
    }


workflow = StateGraph(AgentState)

workflow.add_node("supervisor", supervisor_agent)
workflow.add_node("tools", tool_node)
workflow.add_node("responder", responder_node)

workflow.set_entry_point("supervisor")

workflow.add_conditional_edges(
    "supervisor", lambda x: x["next_node"], {"tools": "tools", "responder": "responder"}
)

workflow.add_edge("tools", "responder")
workflow.add_edge("responder", END)

app_graph = workflow.compile()


class CRMGraph:
    @staticmethod
    async def run(user_input: str, history: List[BaseMessage] = None):
        if history is None:
            history = []

        initial_state = {
            "messages": history + [HumanMessage(content=user_input)],
            "next_node": "supervisor",
            "structured_data": {},
            "final_response": {},
        }

        final_state = await app_graph.ainvoke(initial_state)
        return final_state["final_response"]
