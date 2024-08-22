'use client';

import { ProfileHeader, OwnedEntities } from '~/components/screens';

const ProfilePage = () => {
  return (
    <div
      className="flex flex-col min-h-screen mb-10"
      style={{
        backgroundImage:
          "radial-gradient(rgba(0, 0, 0, 0.8) 49%, rgba(0, 0, 0, 0.8) 100%), url('/images/home.png')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      <ProfileHeader />
      <OwnedEntities />
    </div>
  );
};

export default ProfilePage;
