"""intital tables

Revision ID: 446ad454ef77
Revises: 
Create Date: 2026-05-09 22:05:33.783373

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '446ad454ef77'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create interactions table
    op.create_table(
        'interactions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('hcp_name', sa.String(), nullable=True),
        sa.Column('sentiment', sa.String(), nullable=True),
        sa.Column('topics', sa.Text(), nullable=True),
        sa.Column('followups', sa.Text(), nullable=True),
        sa.Column('summary', sa.Text(), nullable=True),
        sa.Column('interaction_type', sa.String(), nullable=True),
        sa.Column('duration', sa.Integer(), nullable=True),
        sa.Column('location', sa.String(), nullable=True),
        sa.Column('attendees', sa.Text(), nullable=True),
        sa.Column('internal_participants', sa.Text(), nullable=True),
        sa.Column('meeting_mode', sa.String(), nullable=True),
        sa.Column('clinical_insights', sa.Text(), nullable=True),
        sa.Column('objections', sa.Text(), nullable=True),
        sa.Column('competitor_mentions', sa.Text(), nullable=True),
        sa.Column('patient_concerns', sa.Text(), nullable=True),
        sa.Column('prescription_intent', sa.String(), nullable=True),
        sa.Column('interest_level', sa.String(), nullable=True),
        sa.Column('engagement_score', sa.Integer(), nullable=True),
        sa.Column('buying_intent_score', sa.Integer(), nullable=True),
        sa.Column('outcome', sa.String(), nullable=True),
        sa.Column('outcome_notes', sa.Text(), nullable=True),
        sa.Column('outcome_priority', sa.String(), nullable=True),
        sa.Column('risk_level', sa.String(), nullable=True),
        sa.Column('materials_shared', sa.Text(), nullable=True),
        sa.Column('samples_distributed', sa.Text(), nullable=True),
        sa.Column('followup_tasks', sa.Text(), nullable=True),
        sa.Column('compliance_reviewed', sa.Boolean(), nullable=True),
        sa.Column('approval_status', sa.String(), nullable=True),
        sa.Column('flagged_content', sa.Text(), nullable=True),
        sa.Column('adverse_event', sa.Boolean(), nullable=True),
        sa.Column('medical_review_status', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('updated_by_ai', sa.Boolean(), server_default='false', nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_interactions_id'), 'interactions', ['id'], unique=False)

    # Create edit_history table
    op.create_table(
        'edit_history',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('interaction_id', sa.Integer(), nullable=True),
        sa.Column('field', sa.String(), nullable=True),
        sa.Column('old_value', sa.Text(), nullable=True),
        sa.Column('new_value', sa.Text(), nullable=True),
        sa.Column('changed_by', sa.String(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_edit_history_id'), 'edit_history', ['id'], unique=False)
    op.create_index(op.f('ix_edit_history_interaction_id'), 'edit_history', ['interaction_id'], unique=False)

    # Create notifications table
    op.create_table(
        'notifications',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('type', sa.String(), nullable=True),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('is_read', sa.Boolean(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=True),
        sa.Column('metadata_json', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_notifications_id'), 'notifications', ['id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_notifications_id'), table_name='notifications')
    op.drop_table('notifications')
    op.drop_index(op.f('ix_edit_history_interaction_id'), table_name='edit_history')
    op.drop_index(op.f('ix_edit_history_id'), table_name='edit_history')
    op.drop_table('edit_history')
    op.drop_index(op.f('ix_interactions_id'), table_name='interactions')
    op.drop_table('interactions')
