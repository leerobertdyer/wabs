### SQL lite is **not** the Postgres dialect. 
> It's a separate engine with its own SQL. The basics (SELECT, INSERT, WHERE, JOIN) look the same, but they aren't. Server will be Postgres later, so follow these types:

- Loose typing. Column types are hints, not rules.
- No real booleans. Use 0/1 integers (your is_marked).
- No UUID or timestamp types. Store UUIDs as TEXT and times as integer milliseconds.
- Placeholders are ?, not $1.
- Foreign keys are off by default. Turn them on with PRAGMA foreign_keys = ON.
- ALTER TABLE is limited. Changing a column type means rebuilding the table, so plan migrations.