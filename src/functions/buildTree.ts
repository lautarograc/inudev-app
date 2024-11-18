import { Todo } from '../interfaces/Todo.interface';
import type { DataNode } from 'antd/lib/tree';

export const buildTodoTree = (todos: Todo[]): DataNode[] => {
    const idToNode: Record<number, DataNode> = {};

    todos.forEach((todo) => {
        idToNode[todo.id] = {
            title: todo.name,
            key: todo.id.toString(),
            children: [],
        };
    });

    const rootNodes: DataNode[] = [];

    todos.forEach((todo) => {
        const parentId = todo.level_hash.parent;
        if (parentId !== null) {
            const parentNode = idToNode[parentId];
            if (parentNode) {
                parentNode.children!.push(idToNode[todo.id]);
            } else {
                rootNodes.push(idToNode[todo.id]);
            }
        } else {
            rootNodes.push(idToNode[todo.id]);
        }
    });

    return rootNodes;
};

export const setIsLeafFalse = (nodes: any[]): any[] => {
    return nodes.map(node => ({
        ...node,
        isLeaf: false,
        children: node.children ? setIsLeafFalse(node.children) : [],
    }));
};
