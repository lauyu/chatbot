"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabase/browser-client";
import EditUserModal from './EditUserModal'; // 引入修改弹出框组件
import AddUserModal from './AddUserModal'; // 引入新增弹出框组件
import DeleteConfirmationModal from './DeleteConfirmationModal'; // 引入删除确认框组件

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [goToPage, setGoToPage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // 当前选中的用户
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 控制修改弹出框显示
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // 控制新增弹出框显示
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 控制删除确认框显示
  const [userToDelete, setUserToDelete] = useState(null); // 待删除的用户

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*'); // 确保查询了 userPermissions 字段

      if (error) {
        throw error;
      }

      setUsers(data);
    } catch (error) {
      console.error('Error fetching Users:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // 计算当前页的数据
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  // 分页按钮逻辑
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < Math.ceil(users.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(goToPage, 10);
    if (pageNumber >= 1 && pageNumber <= Math.ceil(users.length / itemsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setItemsPerPage(value);
      setCurrentPage(1);
    }
  };

  // 打开删除确认框
  const handleDeleteClick = (user) => {
    setUserToDelete(user); // 设置待删除的用户
    setIsDeleteModalOpen(true); // 打开删除确认框
  };

  // 确认删除
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userToDelete.id);

      if (error) {
        throw error;
      }

      fetchUsers();
      alert('用户删除成功');
    } catch (error) {
      console.error('Error deleting user:', error.message);
      alert('用户删除失败');
    } finally {
      setIsDeleteModalOpen(false); // 关闭删除确认框
      setUserToDelete(null); // 清空待删除的用户
    }
  };

  // 取消删除
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false); // 关闭删除确认框
    setUserToDelete(null); // 清空待删除的用户
  };

  // 打开修改框
  const handleEditClick = (user) => {
    setSelectedUser(user); // 设置选中的用户
    setIsEditModalOpen(true); // 打开修改弹出框
  };

  // 打开新增框
  const handleAddClick = () => {
    setIsAddModalOpen(true); // 打开新增弹出框
  };

  // 关闭修改框
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  // 关闭新增框
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#1e1e1e',
      color: '#fff',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', width: '100%' }}>用户列表</h1>
      <div style={{
        width: '100%',
        flex: 1,
        overflow: 'auto',
        position: 'relative' // 用于定位新增按钮
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          {/* 新增按钮 */}
          <div style={{ flex: 1 }}></div>
          <button
            onClick={handleAddClick}
            style={{
              padding: '8px 12px',
              backgroundColor: '#1e90ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            新增
          </button>
        </div>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#2d2d2d',
          color: '#fff'
        }}>
          <thead>
          <tr style={{ backgroundColor: '#333', color: '#fff' }}>
            <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>用户 ID</th>
            <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>姓名</th>
            <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>用户 Email</th>
            <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>激活状态</th>
            <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>用户权限</th>
            <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>创建时间</th>
            <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>编辑</th>
          </tr>
          </thead>
          <tbody>
          {currentUsers.map((user, index) => (
            <tr key={user.id} style={{
              backgroundColor: index % 2 === 0 ? '#2d2d2d' : '#3d3d3d',
              borderBottom: '1px solid #444'
            }}>
              <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'left' }}>{user.id}</td>
              <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'left' }}>{user.name}</td>
              <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'left' }}>{user.email}</td>
              <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'left' }}>{user.activeState}</td>
              <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'left' }}>{user.userPermissions}</td>
              <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'left' }}>{user.createTime}</td>
              <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'left' }}>
                <button
                  onClick={() => handleEditClick(user)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#1e90ff',
                    cursor: 'pointer',
                    marginRight: '8px'
                  }}
                >
                  修改
                </button>
                |
                <button
                  onClick={() => handleDeleteClick(user)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#ff4500',
                    cursor: 'pointer',
                    marginLeft: '8px'
                  }}
                >
                  删除
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      {/* 分页按钮区域 */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          style={{
            padding: '8px 12px',
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          上一页
        </button>
        <span style={{ padding: '8px 12px' }}>当前页：{currentPage}</span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === Math.ceil(users.length / itemsPerPage)}
          style={{
            padding: '8px 12px',
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === Math.ceil(users.length / itemsPerPage) ? 'not-allowed' : 'pointer'
          }}
        >
          下一页
        </button>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <span>跳转到</span>
          <input
            type="number"
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            min="1"
            max={Math.ceil(users.length / itemsPerPage)}
            style={{
              padding: '8px',
              width: '60px',
              backgroundColor: '#444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px'
            }}
          />
          <span>页</span>
          <button
            onClick={handleGoToPage}
            style={{
              padding: '8px 12px',
              backgroundColor: '#444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            跳转
          </button>
        </div>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <span>每页显示</span>
          <input
            type="number"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            min="1"
            style={{
              padding: '8px',
              width: '60px',
              backgroundColor: '#444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px'
            }}
          />
          <span>条</span>
        </div>
      </div>

      {/* 修改弹出框 */}
      {isEditModalOpen && (
        <EditUserModal
          user={selectedUser}
          onClose={handleCloseEditModal}
          onSave={fetchUsers} // 保存后刷新用户列表
        />
      )}

      {/* 新增弹出框 */}
      {isAddModalOpen && (
        <AddUserModal
          onClose={handleCloseAddModal}
          onSave={fetchUsers} // 保存后刷新用户列表
        />
      )}

      {/* 删除确认框 */}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          userName={userToDelete?.name || ''}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default UserList;