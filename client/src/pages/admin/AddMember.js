import React from 'react';
import { navigate } from '../../router';
import MemberForm from './MemberForm';
import { createMember } from './memberApi';

export default function AddMember() {
  const listPath = window.location.hash.startsWith('#/admin') ? '/admin/team-members/list' : '/student/team-members/list';

  return (
    <div className="sc-center sc-stack sc-stack--lg">
      <div className="sc-pageHeader">
        <div>
          <h2 className="sc-h2">Add New Member</h2>
        </div>
      </div>
      <MemberForm
        submitLabel="Add Member"
        onSubmit={async (value) => {
          await createMember(value);
          navigate(listPath);
        }}
      />
    </div>
  );
}
