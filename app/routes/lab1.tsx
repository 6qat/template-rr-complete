import { Outlet } from 'react-router';
import type { Route } from './+types/lab1';
import { Button } from '~/components/ui';
import { useTheme } from '~/contexts/theme-provider';

// https://reactrouter.com/how-to/file-route-conventions

export async function loader({ params }: Route.LoaderArgs) {
  console.log(params);
  return { message: 'Hello, world!' };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const _serverData = await serverLoader();
  const data = {};
  return data;
}

export async function action({ params }: Route.ActionArgs) {
  console.log(params);
  return { message: 'Hello, world!' };
}

export async function clientAction({ serverAction }: Route.ClientActionArgs) {
  const _serverData = await serverAction();
  const data = {};
  return data;
}

export default function Lab1({
  loaderData,
  actionData,
  params,
  matches,
}: Route.ComponentProps) {
  const { setTheme } = useTheme();
  return (
    <>
      <div className='text-5xl'>Lab1</div>
      <Button intent='primary' onPress={() => setTheme('light')}>
        Light
      </Button>
      <Button intent='secondary' onPress={() => setTheme('dark')}>
        Dark
      </Button>
      <h1>Welcome to My Route with Props!</h1>
      <p>Loader Data: {JSON.stringify(loaderData)}</p>
      <p>Action Data: {JSON.stringify(actionData)}</p>
      <p>Route Parameters: {JSON.stringify(params)}</p>
      <p>Matched Routes: {JSON.stringify(matches)}</p>
      <Outlet />
    </>
  );
}
