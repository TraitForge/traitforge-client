import { ProfileHeader, OwnedEntities } from '~/components/screens';

const ProfilePage = () => {
  return (
    <div className="bg-custom-radial">
      <div
        className="flex flex-col h-full "
        style={{
          backgroundImage: "radial-gradient(rgba(0, 0, 0, 0.8) 49%, rgba(0, 0, 0, 0.8) 100%), url('/images/home.png')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
      >
        <ProfileHeader />
        <OwnedEntities />
      </div>
    </div>
  );
};

export default ProfilePage;
