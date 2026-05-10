from app.langgraph.workflow import CRMGraph
from app.tools.clinical_intelligence_tool import extract_clinical_intelligence
from langchain_core.messages import HumanMessage, AIMessage
import json


class ChatService:
    @staticmethod
    async def process_chat_request(question: str, context: dict, history: list):
        """
        Processes a chat request using the LangGraph supervisor workflow.
        """
        lc_history = []
        if history:
            for msg in history:
                role = msg.get("role", "user")
                content = msg.get("content", "")
                if role == "user":
                    lc_history.append(HumanMessage(content=content))
                else:
                    lc_history.append(AIMessage(content=content))

        return await CRMGraph.run(question, lc_history)

    @staticmethod
    async def process_extraction_request(text: str):
        """
        Performs deep clinical extraction for new interactions.
        """

        return await extract_clinical_intelligence.ainvoke(text)
