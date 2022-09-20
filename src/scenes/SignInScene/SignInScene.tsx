import { IProvider } from 'src/pages/auth/signin';
import { signIn } from 'next-auth/react';
import CustomButton from 'src/components/atoms/Button/CustomButton';

type IProps = {
  providers: IProvider[];
};

export default function SignInScene({ providers }: IProps) {
  const options = {
    callbackUrl: '/',
    redirect: true,
  };

  return (
    <div>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <CustomButton href="#" onClick={() => signIn(provider.id, options)}>
            <p>Sign in with {provider.name}</p>
          </CustomButton>
        </div>
      ))}
    </div>
  );
}
