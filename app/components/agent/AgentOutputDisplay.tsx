'use client'

import { useEffect, useRef, useState, RefObject } from 'react';

interface AgentOutputDisplayProps {
	video: string;
	containerRef: RefObject<HTMLDivElement>;
	videoPlayEnabled: boolean;
	text: string;
}

export default function AgentOutputDisplay({ video, containerRef, videoPlayEnabled, text }: AgentOutputDisplayProps) {
	const [displayText, setDisplayText] = useState('');
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (!videoPlayEnabled) setDisplayText(text);

		if (text.length > 0 && videoPlayEnabled && containerRef) {
			setDisplayText('');

			const timeouts: NodeJS.Timeout[] = [];

			if (videoRef.current) {
				videoRef.current.play();
			}
			for(let i = 0; i < text.length; i++) {
				const timeout = setTimeout(() =>{
					setDisplayText((prev) => prev + text[i]);

					if (containerRef.current) {
						containerRef.current.scrollTop = containerRef.current.scrollHeight;
					}

					if (i === text.length - 1 && videoRef.current) {
						videoRef.current.pause();
						videoRef.current.currentTime = 0;
					}
				}, i * 30);
				timeouts.push(timeout);
			}

			return () => timeouts.forEach(clearTimeout);
		}
	}, [text, videoPlayEnabled, containerRef])

	return (
		<div className="flex align-items-start gap-2">
			<video
				ref={videoRef}
				loop
				muted
				className="w-8 h-8 rounded-sm"
				src={video}
			/>
			<div className="p-1 w-full rounded-md bg-gray-200">{displayText}</div>
		</div>
	)
}