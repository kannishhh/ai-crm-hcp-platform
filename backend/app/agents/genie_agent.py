import json
from app.services.groq_service import llm
from app.prompts.genie_prompts import CLINICAL_EXTRACTION_PROMPT, GENIE_CHAT_PROMPT


class GenieAgent:
    @staticmethod
    async def extract_intelligence(text: str):
        prompt = CLINICAL_EXTRACTION_PROMPT.format(text=text)
        try:
            response = await llm.ainvoke(prompt)
            result = GenieAgent._parse_json(response.content)

            if "answer" in result and len(result.keys()) == 1:

                return {
                    "summary": result["answer"][:200] + "...",
                    "sentiment": "Neutral",
                    "clinical_insights": "Analysis completed, but data format was unconventional.",
                    "interest_level": "Medium",
                    "followups": [],
                }
            return result
        except Exception as e:
            print(f"Extraction Error: {e}")
            return {"summary": "Error analyzing interaction.", "sentiment": "Neutral"}

    @staticmethod
    async def chat(question: str, context: dict, history: list = None):
        history_str = json.dumps(history) if history else "No previous history."
        context_str = json.dumps(context, indent=2)

        prompt = GENIE_CHAT_PROMPT.format(
            question=question, context=context_str, history=history_str
        )

        try:
            response = await llm.ainvoke(prompt)
            return GenieAgent._parse_json(response.content)
        except Exception as e:
            print(f"Chat Error: {e}")
            return {
                "answer": "I encountered an error processing your request.",
                "suggested_actions": [],
                "insights_flag": "general",
            }

    @staticmethod
    def _parse_json(content: str):
        content = content.strip()

        json_str = None
        if "```json" in content:
            json_str = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            json_str = content.split("```")[1].split("```")[0].strip()

        if json_str:
            try:
                return json.loads(json_str, strict=False)
            except:
                pass

        if "{" in content and "}" in content:
            start = content.find("{")
            end = content.rfind("}") + 1
            json_str = content[start:end]
            try:
                json_str = json_str.replace("\\n", " ").replace("\\t", " ")
                return json.loads(json_str, strict=False)
            except Exception as e:
                print(f"JSON Parse Error in block: {e}")

        try:
            return json.loads(content, strict=False)
        except Exception as e:
            print(f"Full JSON Parse Error: {e}")
            return {"answer": content}
