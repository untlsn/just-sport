import { Dialog } from '@kobalte/core/dialog';
import style from './TheHeader.module.css';
import clsx from 'clsx';

export default function TheHeader(): JSXElement {
	return (
		<div class="h-16">
			<header class="h-inherit fixed top-0 left-0 w-full p-4 shadow-lg bg-primary-4 text-white flex gap-4 items-center">
				<Dialog>
					<Dialog.Trigger class="i-ph-barbell rotate-90 text-8 data-[expanded]:rotate-0 transition-transform" />
					<Dialog.Portal>
						<Dialog.Content class={clsx('fixed left-0 top-16 bg-primary-3 h-[calc(100vh-4rem)] w-72 p-4 text-white', style.CollapsibleContent)}>
							<ul>
								<TheHeaderDialogLink
									href="/"
									class="before:i-ph-house-bold"
								>
									Strona główna
								</TheHeaderDialogLink>
								<TheHeaderDialogLink
									href="/place/create"
									class="before:i-ph-map-trifold-fill"
								>
									Dodaj placówke
								</TheHeaderDialogLink>
							</ul>
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog>
				<h1>
					<a href="/" class="flex items-center gap-1 text-6">
						Just <i class="i-ph-arrow-fat-lines-right-fill" /> sport
					</a>
				</h1>
			</header>
		</div>
	);
}

function TheHeaderDialogLink(props: { class: string, children: JSXElement, href: string }): JSXElement {
	return (
		<Dialog.CloseButton as="li">
			<a href={props.href} class={clsx('before:(c_ text-8 translate-y-1 mr-2) font-600', props.class)}>
				{props.children}
			</a>
		</Dialog.CloseButton>
	);
}