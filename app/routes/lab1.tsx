import { Form, Outlet, useNavigation } from 'react-router';
import type { Route } from './+types/lab1';
import { Button } from '~/components/ui';
import { useTheme } from '~/contexts/theme-provider';
import { useIsSSR } from 'react-aria';

// https://reactrouter.com/how-to/file-route-conventions

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  // const _serverData = await serverLoader();
  return { message: 'Hello, world! (CLIENT LOADER)' };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  // const _serverData = await serverAction();
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { message: 'Hello, world! (CLIENT ACTION)' };
}

export default function Lab1({
  loaderData,
  actionData,
  params,
  matches,
}: Route.ComponentProps) {
  const { setTheme } = useTheme();
  const isSSR = useIsSSR();
  const { state } = useNavigation();
  const busy = state === 'submitting';
  return (
    <>
      <div className='text-5xl'>Lab1</div>
      <Button intent='primary' onPress={() => setTheme('light')}>
        Light
      </Button>
      <Button intent='secondary' onPress={() => setTheme('dark')}>
        Dark
      </Button>
      {isSSR && (
        <p className='text-3xl text-red-500'>Rendering on server (SSR)</p>
      )}
      <Form method='post'>
        <Button type='submit'>
          {busy ? 'Creating...' : 'Create New Project'}
        </Button>
      </Form>
      <h1>Welcome to My Route with Props!</h1>
      <p>Loader Data: {JSON.stringify(loaderData)}</p>
      <p>Action Data: {JSON.stringify(actionData)}</p>
      <p>Route Parameters: {JSON.stringify(params)}</p>
      <p>Matched Routes: {JSON.stringify(matches)}</p>
      <Outlet />
    </>
  );
}
