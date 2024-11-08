import { createEffect, onMount } from 'solid-js';
import * as Gl from 'maplibre-gl';
import { isServer } from 'solid-js/web';
import 'maplibre-gl/dist/maplibre-gl.css';


export type Cords = {
	lng: number;
	lat: number;
};
const warsawCords: Cords = {
	lng: 21.017532,
	lat: 52.237049,
};

const fetchCurrentLocation = async () => {
	return new Promise<Cords>((res) => {
		if (isServer) return warsawCords;
		navigator.geolocation.getCurrentPosition(({ coords }) => {
			res({
				lat: coords.latitude,
				lng: coords.longitude,
			});
		}, () => {
			res(warsawCords);
		});
	});
};


export default function ObjectFormMap(props: {
	onChange: (cords: Cords) => void
	value?:   Cords,
}): JSXElement {
	const container = <div class="w-full h-100" /> as HTMLElement;

	onMount(() => {
		const map = new Gl.Map({
			style:  'https://tiles.openfreemap.org/styles/liberty',
			center: warsawCords,
			zoom:   9.5,
			container,
		});

		fetchCurrentLocation().then((it) => map.setCenter(it));

		// eslint-disable-next-line solid/reactivity
		map.on('click', async ({ lngLat }) => {
			const newPin = {
				lng: lngLat.lng,
				lat: lngLat.lat,
			};
			props.onChange(newPin);
		});

		createEffect((marker: Gl.Marker | undefined) => {
			const pinSnap = props.value;
			if (!pinSnap) return;
			if (marker) return marker.setLngLat(pinSnap);

			return new Gl.Marker()
				.setLngLat(pinSnap)
				.addTo(map);
		});
	});

	return container;
}