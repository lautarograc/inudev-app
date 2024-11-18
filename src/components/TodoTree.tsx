import React, { useEffect, useState } from 'react';
import { Spin, message, Tree, Card, Button, Modal } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Todo } from '../interfaces/Todo.interface';
import { fetchTodoChildren, fetchTodos, updateTodo, createTodo, deleteTodo } from '../api/todos';
import styles from './TodoTree.module.css';
import { DataNode } from 'antd/lib/tree';
import TodoModal from './TodoModal';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Filters } from '../interfaces/Filters.interface';
import TodoFilter from './TodoFilter';

const PAGE_LIMIT = 10;

const TodoTree: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<Todo | null>(null);
  const [parentId, setParentId] = useState<number | null>(null);
  const [filters, setFilters] = useState<Filters>({});

  const todoToTreeNode = (todo: Todo): DataNode => ({
    title: renderCard(todo),
    key: todo.id.toString(),
    isLeaf: todo.children_count === 0,
  });

  const renderCard = (todo: Todo): React.ReactNode => {
    const priorityColors: { [key in Todo['priority']]: string } = {
      low: 'green',
      medium: 'yellow',
      high: 'red',
    };

    const getDueInDays = (dueDate: string | undefined) => {
      if (!dueDate) return 'No due date';
      const currentDate = new Date();
      const dueDateObj = new Date(dueDate);
      const diffTime = dueDateObj.getTime() - currentDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 ? `Due in ${diffDays} days` : `Overdue by ${Math.abs(diffDays)} days`;
    };

    return (
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: priorityColors[todo.priority] || 'gray',
                marginRight: 8,
              }}
            ></span>
            {todo.name}
          </div>
        }
        className={styles.card}
        actions={[
          <a key="edit" onClick={() => showEditModal(todo)}>
            Edit
          </a>,
          <a key="add" onClick={() => showCreateModal(todo.id)}>
            Add Child
          </a>,
          <a key="delete" onClick={() => showDeleteConfirm(todo)}>
            Delete
          </a>,
        ]}
      >
        <p>{todo.description || 'No description'}</p>
        <p>
          <strong>Due:</strong> {getDueInDays(todo.due_date)}
        </p>
        {/* Status */}
        <p>
          <strong>Status:</strong> {todo.status || 'Not specified'}
        </p>
      </Card>
    );
  };

  const updateTreeData = (
    list: DataNode[],
    key: React.Key,
    children: DataNode[]
  ): DataNode[] =>
    list.map((node) => {
      if (node.key === key) {
        return {
          ...node,
          children,
          isLeaf: false,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });

  const findNode = (nodes: DataNode[], key: React.Key): DataNode | null => {
    for (const node of nodes) {
      if (node.key === key) {
        return node;
      }
      if (node.children) {
        const found = findNode(node.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  const loadMoreData = async () => {
    if (loading) {
      return;
    }
    setLoading(true);

    try {
      const data = await fetchTodos(currentPage, filters);
      if (data.todos.length === 0 || currentPage >= PAGE_LIMIT) {
        setHasMore(false);
      } else {
        const nodes = data.todos.map(todoToTreeNode);
        setTreeData((prevTreeData) => [...prevTreeData, ...nodes]);
        setCurrentPage((prevPage) => prevPage + 1);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to load todos.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const onLoadData = async (node: DataNode): Promise<void> => {
    if (node.children) {
      return;
    }

    try {
      const data = await fetchTodoChildren(Number(node.key)) as any;
      const childNodes = data.level_hash.children.map(todoToTreeNode);
      setTreeData((origin) => updateTreeData(origin, node.key, childNodes));
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to load children.');
    }
  };

  const showEditModal = (item: Todo) => {
    setCurrentItem(item);
    setIsModalVisible(true);
  };

  const showCreateModal = (parentId: number | null = null) => {
    setParentId(parentId);
    setCurrentItem(null);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentItem(null);
    setParentId(null);
  };

  const showDeleteConfirm = (todo: Todo) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this todo?',
      icon: <ExclamationCircleOutlined />,
      content: todo.name,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(todo);
      },
    });
  }

  const handleDelete = async (todo: Todo) => {
    try {
      await deleteTodo(Number(todo.id));
      message.success('Todo deleted successfully');
      setTreeData((prevTreeData) => removeNode(prevTreeData, todo.id.toString()));
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to delete todo.');
    }
  };

  const removeNode = (nodes: DataNode[], key: React.Key): DataNode[] => {
    return nodes
      .filter((node) => node.key !== key)
      .map((node) => {
        if (node.children) {
          return {
            ...node,
            children: removeNode(node.children, key),
          };
        }
        return node;
      });
  }

  const handleOk = async (item: any) => {
    try {
      if (currentItem) {
        const updatedTodo = await updateTodo(Number(currentItem.id), item);
        message.success('Todo updated successfully');
        setTreeData((prevTreeData) =>
          prevTreeData.map((node) =>
            node.key === updatedTodo.id.toString()
              ? { ...node, title: renderCard(updatedTodo) }
              : node
          )
        );
      } else {
        const newTodo = await createTodo({ ...item, parent_id: parentId });
        message.success('Todo created successfully');
        if (parentId === null) {
          setTreeData((prevTreeData) => [...prevTreeData, todoToTreeNode(newTodo)]);
        } else {
          setTreeData((prevTreeData) =>
            updateTreeData(prevTreeData, parentId.toString(), [
              ...(findNode(prevTreeData, parentId.toString())?.children || []),
              todoToTreeNode(newTodo),
            ])
          );
        }
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Operation failed.');
    } finally {
      handleCancel();
    }
  };

  const applyFilter = (appliedFilters: Filters) => {
    setFilters(appliedFilters);
    setTreeData([]);
    setCurrentPage(1);
    setHasMore(true);
  };

  const clearFilter = () => {
    setFilters({});
    setTreeData([]);
    setCurrentPage(1);
    setHasMore(true);
  };

  useEffect(() => {
    loadMoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div
      className={styles.container}
      id="scrollableDiv"
      style={{ height: '400px', overflow: 'auto' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Button type="primary" onClick={() => showCreateModal(null)}>
          Create Todo
        </Button>
        <TodoFilter onApply={applyFilter} onClear={clearFilter} />
      </div>
      {Object.keys(filters).length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <strong>Applied Filters:</strong>
          {Object.entries(filters).map(([key, value]) => (
            <span key={key} style={{ marginLeft: 8 }}>
              {key.replace('_', ' ').replace('at_eq', ' on ')}: {value}
            </span>
          ))}
        </div>
      )}
      <InfiniteScroll
        dataLength={treeData.length}
        next={loadMoreData}
        hasMore={hasMore}
        loader={
          <div style={{ textAlign: 'center', padding: 16 }}>
            <Spin />
          </div>
        }
        endMessage={
          <div style={{ textAlign: 'center', padding: 16 }}>
            <b>No more todos to load</b>
          </div>
        }
        scrollableTarget="scrollableDiv"
      >
        <Tree
          loadData={onLoadData}
          treeData={treeData}
          showLine
          defaultExpandAll
        />
      </InfiniteScroll>
      <TodoModal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        item={currentItem}
      />
    </div>
  );
};

export default TodoTree;
