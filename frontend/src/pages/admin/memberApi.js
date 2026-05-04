import axios from 'axios';

const api = axios.create();

function toFormData(value) {
  const fd = new FormData();
  const fields = ['name', 'rollNumber', 'year', 'degree', 'aboutProject', 'hobbies', 'certificate', 'internship', 'aboutAim'];

  fields.forEach((field) => {
    fd.append(field, value?.[field] || '');
  });

  if (value?.profilePhoto instanceof File) {
    fd.append('profilePhoto', value.profilePhoto);
  }

  return fd;
}

export async function fetchMembers() {
  const res = await api.get('/api/members');
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
}

export async function fetchMember(id) {
  const res = await api.get(`/api/members/${id}`);
  return res.data?.data || res.data || null;
}

export async function createMember(formData) {
  const res = await api.post('/api/members', toFormData(formData));
  return res.data?.data || null;
}

export async function updateMember(id, payload) {
  const res = await api.put(`/api/members/${id}`, toFormData(payload));
  return res.data?.data || null;
}

export async function deleteMember(id) {
  const res = await api.delete(`/api/members/${id}`);
  return res.data?.data || null;
}

export function validateMember(value) {
  const required = ['name', 'rollNumber', 'year', 'degree', 'certificate', 'internship', 'aboutAim'];
  const missing = required.filter((k) => !String(value?.[k] || '').trim());
  return missing.length ? `Please fill required fields: ${missing.join(', ')}` : '';
}

export function memberPhotoSrc(photoUrl) {
  if (!photoUrl) return '';
  if (/^https?:\/\//i.test(photoUrl)) return photoUrl;
  return photoUrl;
}
