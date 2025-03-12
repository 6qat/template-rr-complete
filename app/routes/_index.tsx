import type { Route } from './+types/_index';

export async function loader({ params }: Route.LoaderArgs) {
  console.log(params);
  return { message: 'Hello, world!' };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const _serverData = await serverLoader();
  const data = {};
  return data;
}

export default function Home({
  loaderData,
  actionData,
  params,
  matches,
}: Route.ComponentProps) {
  console.log(loaderData, actionData, params, matches);
  return <div>Home</div>;
}
