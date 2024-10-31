import { fetchUserProfile, updateSportsAction } from '~/server/auth';
import { createAsync, useAction, useSubmission } from '@solidjs/router';
import ProfileSportsList from '~/components/ProfileSportsList';

export default function ThePage(): JSXElement {
	const userProfile = createAsync(() => fetchUserProfile());

	const sportsUpdating = useSubmission(updateSportsAction);

	return (
		<main>
			<section class="grid-(~ cols-auto-2 rows-auto-2) w-fit gap-2 mt-12 mb-20">
				<i class="i-ph-user-circle-fill size-20 row-span-2 text-gray-7" />
				<p class="self-end"><b>Imie i nazwisko: </b>{userProfile()?.name}</p>
				<p><b>Email: </b>{userProfile()?.email}</p>
			</section>
			<div class="grid-(~ cols-fit-100)">
				<ProfileSportsList
					sports={sportsUpdating.result || userProfile()?.sports || undefined}
					onSubmit={/*@once*/useAction(updateSportsAction)}
				/>
				<div />
				<div />
			</div>
		</main>
	);
}