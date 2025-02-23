"use client";

import React, { useState } from 'react';
import { supabase } from "@/lib/supabase/browser-client";

interface AddUserModalProps {
  onClose: () => void;
  onSave: () => void;
}

const AddUserModal = ({ onClose, onSave }: AddUserModalProps) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [activeState, setActiveState] = useState(1); // 默认激活状态
  const [userPermissions, setUserPermissions] = useState(''); // 用户权限
  const [error, setError] = useState(''); // 错误提示

  // 提交新增用户
  const handleSubmit = async () => {
    if (!id || !name || !email) {
      setError('用户ID、姓名和Email不能为空');
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .insert([{ id, name, email, activeState, userPermissions }]);

      if (error) {
        throw error;
      }

      onSave(); // 调用父组件的保存逻辑
      onClose(); // 关闭弹出框
      alert('数据添加成功');
    } catch (error) {
      console.error('Error adding user:', error.message);
      alert('数据添加失败');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#2d2d2d',
        padding: '20px',
        borderRadius: '8px',
        width: '400px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#fff' }}>新增用户</h2>
        {error && <p style={{ color: '#ff4500', marginBottom: '10px' }}>{error}</p>}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#fff' }}>用户 ID</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #444',
              backgroundColor: '#3d3d3d',
              color: '#fff'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#fff' }}>姓名</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #444',
              backgroundColor: '#3d3d3d',
              color: '#fff'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#fff' }}>用户 Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #444',
              backgroundColor: '#3d3d3d',
              color: '#fff'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#fff' }}>激活状态</label>
          <select
            value={activeState}
            onChange={(e) => setActiveState(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #444',
              backgroundColor: '#3d3d3d',
              color: '#fff'
            }}
          >
            <option value={1}>激活</option>
            <option value={0}>未激活</option>
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#fff' }}>用户权限</label>
          <input
            type="text"
            value={userPermissions}
            onChange={(e) => setUserPermissions(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #444',
              backgroundColor: '#3d3d3d',
              color: '#fff'
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 12px',
              backgroundColor: '#444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: '8px 12px',
              backgroundColor: '#1e90ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            提交
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;