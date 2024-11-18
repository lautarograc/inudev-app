export interface LevelHash {
    id: number;
    parent: number | null;
    children: Todo[];
    siblings: number[];
}

export interface Todo {
    id: number;
    children_count: number;
    description: string | null;
    level_hash: LevelHash;
    name: string;
    parent_name: string | null;
    parent_token: string | null;
    token: string;
    status: string;
    due_date: string;
    priority: string;
}

export interface FetchTodosResponse {
    total_count: number;
    current_page: number;
    todos: Todo[];
}
