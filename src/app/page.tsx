import Image from 'next/image'
import styles from './page.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faLastfm, faGithub } from '@fortawesome/free-brands-svg-icons'

const URL = (apiKey: any) => `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=angelicrosey&api_key=${apiKey}&format=json&limit=1&nowplaying=true`

async function fetchData() {
	const apiKey = process.env.API_KEY // Make sure you've set this in your environment variables
	const res = await fetch(URL(apiKey), {
		cache: 'force-cache', // Use this to cache the response at the server level (not on each client request)
		next: {
			revalidate: 60 // Revalidate the cache every 60 seconds
		}
	})

	if (!res.ok) {
		throw new Error('Failed to fetch data')
	}
	const data = await res.json()
	const track = data.recenttracks.track[0]

	return {
		song: track ? track.name : 'Song Name',
		artist: track ? track.artist['#text'] : 'Artist Name',
		cover: track ? track.image[3]['#text'] : '/avatar.jpg' // Set default image if not found
	}
}

export default async function Home() {
	const { song, artist, cover } = await fetchData()
	// Fallback values if fetch fails
	const fallbackSong = song || 'Song Name'
	const fallbackArtist = artist || 'Artist Name'
	const fallbackCover = cover || '/avatar.jpg'
	return (
		<section className={styles.home}>
			<div className={styles.avatar}>
				<Image src="/avatar.jpg" alt="Avatar" width={500} height={500} />
			</div>
			<div className={styles.about}>
				<h1 className={styles.name}>Rose</h1>
				<h2>20 she/her</h2>
			</div>
			<div className={styles.socials}>
				<div className={styles.circle}>
					<a href="" target="_blank">
						<FontAwesomeIcon icon={faTwitter} className="fa-fw" />
					</a>
				</div>
				<div className={styles.circle}>
					<a href="https://www.last.fm/user/angelicrosey" target="_blank">
						<FontAwesomeIcon icon={faLastfm} className="fa-fw" />
					</a>
				</div>
				<div className={styles.circle}>
					<a href="https://github.com/Roseyyx" target="_blank">
						<FontAwesomeIcon icon={faGithub} className="fa-fw" />
					</a>
				</div>
			</div>
			<div className={styles.status}>
				<div className={styles.item}>
					<div className={styles.cover}>
						<Image src={cover} alt="Album Cover" className={styles.coverid} width={500} height={500} />
					</div>
					<div className={styles.text}>
						<p className={styles.header}>Now playing</p>
						<p className={styles.textid}>
							<b>{song}</b>
						</p>
						<p className={styles.textid}>
							by <b>{artist}</b>
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}
