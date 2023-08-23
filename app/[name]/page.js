'use client'
import useTheme from '@/hooks/useTheme'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import * as htmlToImage from "html-to-image"
import styles from './Name.module.css'
import messages from '@/utils/birthdayWishes'
import { Button, CopyLinkButton } from '@/components'
import JSConfetti from 'js-confetti'

const Wish = () => {
    const FileSaver = require('file-saver')
    const jsConfetti = new JSConfetti()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const name = pathname.substring(1)
    const colorNumber = searchParams.get('color')

    const color = colorNumber ? colorNumber : 0
    const [downloading, setDownloading] = useState(false)
    const [downloadedOnce, setDownloadedOnce] = useState(false)
    const audioRef = useRef()

    const router = useRouter()

    const [timer, setTimer] = useState(2)
    const { setTheme } = useTheme()

    useEffect(() => {
        setTheme(color)
        if (downloading === false) {

            const id = setInterval(() => {
                setTimer(() => {
                    console.log('time', jsConfetti)
                    jsConfetti.addConfetti({
                        emojis: ['⚡️', '💥', '✨', '🌸'],
                        emojiSize: 15,
                        confettiRadius: 6,
                        confettiNumber: 100,
                    })
                        .then(() => jsConfetti.clearCanvas())
                    audioRef.current.play()

                })
            }, 5000)

            return () => clearInterval(id)

        }
    }, [color, downloading])

    useEffect(() => {
        if (downloading === true && downloadedOnce === false) {
            downloadImage()
        }
    }, [downloading, downloadedOnce])

    const RandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min
    }

    const downloadImage = () => {
        if (downloadedOnce === true) {
            return
        }

        const node = document.getElementById('image')

        if (node) {
            setDownloadedOnce(true)

            htmlToImage.toPng(node).then((blob) => {
                FileSaver.saveAs(blob, 'birthday-wish.png')
                setDownloading(false)
            })
        }
    }

    const title = (name) => {
        const wish = 'Happy Birthday ' + name + '!'
        const base_letter = []
        const name_letter = []

        for (let i = 0; i < wish.length; i++) {
            if (i < 15) {
                const letter = wish.charAt(i)
                base_letter.push(
                    <span key={i} style={{ '--order': i + 1 }}>
                        {letter}
                    </span>
                )
            } else {
                const letter = wish.charAt(i)
                name_letter.push(
                    <span key={i} style={{ "--order": i + 1 }}>
                        {letter}
                    </span>
                )
            }

        }

        return (
            <>
                {downloading ? (
                    <h1
                        className={styles.titleImg}
                        style={{ "--wishLength": wish.length }}
                    >
                        <div>{base_letter.map((letter) => letter)}</div>
                        <div>{name_letter.map((letter) => letter)}</div>
                    </h1>
                ) : (
                    <h1
                        className={styles.title}
                        style={{ "--wishLength": wish.length }}
                    >
                        <div>{base_letter.map((letter) => letter)}</div>
                        <div>{name_letter.map((letter) => letter)}</div>
                    </h1>
                )}
            </>
        )
    }

    if (downloading) {
        return (
            <div className={styles.containerImg} id='image' onClick={downloadImage}>
                {downloadImage()}
                <main className={styles.image}>
                    <div>
                        <div className={styles.main}>
                            {title(name)}
                        </div>

                        <div style={{ height: 40 }} />

                        <p className={styles.descImg}>
                            {messages[RandomNumber(0, messages.length)].value}
                        </p>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className={styles.container}>


            <canvas className={styles.canvas} id="canvas"></canvas>

            <main className={styles.animate}>
                <div>
                    <div className={styles.main}>{title(name)}</div>
                    <p className={styles.desc}>
                        {messages[RandomNumber(0, messages.length)].value}
                    </p>
                </div>

                <div className={styles.buttonContainer}>
                    <CopyLinkButton />
                    <Button
                        onClick={() => {
                            setDownloadedOnce(false);
                            setDownloading(true);
                        }}
                        text="Download as Image"
                    />

                    <Button
                        onClick={() => router.push("/")}
                        text="&larr; Create a wish"
                    />
                </div>
            </main>
            <audio ref={audioRef} id="player" autoPlay repeat>
                <source src="media/hbd.mp3" />
            </audio>
        </div>
    )
}

export default Wish