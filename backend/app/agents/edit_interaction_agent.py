import json
from app.services.groq_service import llm
from app.prompts.edit_prompts import EDIT_INTERACTION_PROMPT
from app.tools.edit_interaction_tool import edit_interaction_tool


class EditInteractionAgent:
    @staticmethod
    async def process_edit_request(user_input: str, context: dict):
        """
        Parses user natural language into structured edit commands and executes them.
        """
        prompt = EDIT_INTERACTION_PROMPT.format(
            user_input=user_input, context=json.dumps(context, indent=2)
        )

        try:
            response = await llm.ainvoke(prompt)
            from app.agents.genie_agent import GenieAgent

            parsed_response = GenieAgent._parse_json(response.content)

            if not parsed_response or "action" not in parsed_response:
                return {
                    "status": "error",
                    "message": "I couldn't understand what you want to edit. Could you be more specific?",
                }

            if parsed_response.get("action") == "undo":
                interaction_id = parsed_response.get("interaction_id") or context.get(
                    "current_interaction_id"
                )
                if not interaction_id:
                    return {
                        "status": "error",
                        "message": "I don't know which interaction to undo for.",
                    }

                from app.database.db import SessionLocal

                db = SessionLocal()
                try:
                    result = await InteractionUpdateService.undo_last_edit(
                        db, int(interaction_id)
                    )
                    if result:
                        return {
                            "status": "success",
                            "message": "Last edit reverted successfully.",
                        }
                    else:
                        return {"status": "error", "message": "No edits found to undo."}
                finally:
                    db.close()

            if parsed_response.get("action") == "edit_interaction":
                field = parsed_response.get("field")
                value = parsed_response.get("value")
                interaction_id = parsed_response.get("interaction_id") or context.get(
                    "current_interaction_id"
                )

                if not interaction_id:
                    return {
                        "status": "error",
                        "message": "I don't know which interaction you're referring to. Please specify the HCP or the interaction.",
                    }

                if not field or value is None:
                    return {
                        "status": "error",
                        "message": "I identified an edit request but couldn't determine the field or new value.",
                    }

                # Execute the edit
                result = await edit_interaction_tool.ainvoke(
                    {
                        "interaction_id": int(interaction_id),
                        "field": field,
                        "value": value,
                    }
                )

                return result

            return {
                "status": "ignored",
                "message": "This doesn't seem like an edit request.",
            }

        except Exception as e:
            print(f"Edit Interaction Agent Error: {e}")
            return {
                "status": "error",
                "message": f"Something went wrong while processing your edit request: {str(e)}",
            }
