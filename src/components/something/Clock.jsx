import { useEffect, useState } from 'react'
import './style.scss'
import image1 from '../../assets/diego/image1.jpeg'
import image2 from '../../assets/diego/image2.jpeg'
import image3 from '../../assets/diego/image3.jpeg'
import image4 from '../../assets/diego/image4.jpeg'
import image5 from '../../assets/diego/image5.jpeg'

function ActualImage({img, visible}){
    return <img src={img} alt="" className={visible ? 'visible' : ''} />
}

export default function Clock() {
    const [actualImage, setActualImage] = useState(Math.floor(Math.random() * 5));
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const imageInterval = setInterval(() => {
            setActualImage(Math.floor(Math.random() * 5));
        }, 5000);

        const clockInterval = setInterval(() => {
            setDate(new Date());
        }, 1000);
        return () => {clearInterval(imageInterval);clearInterval(clockInterval)}
    }, []);
    
    return (
        <main>
            <section className='imagesContainer'>
                <ActualImage img={image1} visible={actualImage === 0} />
                <ActualImage img={image2} visible={actualImage === 1} />
                <ActualImage img={image3} visible={actualImage === 2} />
                <ActualImage img={image4} visible={actualImage === 3} />
                <ActualImage img={image5} visible={actualImage === 4} />
            </section>

            <section className='clockContainer'>
                <h1>{date.getHours()}:{date.getMinutes()}:{date.getSeconds()}</h1>
                <h3>Today is {date.toDateString()}</h3>
                <h2>Have a beautiful day 🎉</h2>
            </section>
        </main>
    )
}