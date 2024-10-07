
export async function getServerSideProps(context: any) {
  const { referralCode } = context.params;

  // Handle logic for referral code
  // For example, store the referral code in cookies or pass it to a backend
  return {
    redirect: {
      destination: `/home?ref=${referralCode}`,
      permanent: false,
    },
  };
}

const ReferralRedirect = () => null;

export default ReferralRedirect;