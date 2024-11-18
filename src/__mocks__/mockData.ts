import { Todo } from '../interfaces/Todo.interface';

export const mockData: Todo[] = [
  {
    id: 15,
    children_count: 0,
    description: null,
    level_hash: {
      id: 15,
      parent: 13,
      children: [],
      siblings: [],
    },
    name: 'test child level 1',
    parent_name: 'test root 1',
    parent_token: '86702bbc-e86a-46d0-8239-976ba25d0c4f',
    token: '8e652fd5-82c7-4431-8e0d-b1aef8c068fa',
  },
  {
    id: 14,
    children_count: 0,
    description: null,
    level_hash: {
      id: 14,
      parent: null,
      children: [],
      siblings: [13],
    },
    name: 'test root 2',
    parent_name: null,
    parent_token: null,
    token: '7b6d47ff-8e39-47a6-b64f-15e5272f838f',
  },
  {
    id: 13,
    children_count: 1,
    description: null,
    level_hash: {
      id: 13,
      parent: null,
      children: [15],
      siblings: [14],
    },
    name: 'test root 1',
    parent_name: null,
    parent_token: null,
    token: '86702bbc-e86a-46d0-8239-976ba25d0c4f',
  },
];
