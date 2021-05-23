import Image from "next/image";
import { Circle } from "better-react-spinkit"

const Loading = () => {

    return (
        <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
            <div>
                <Image src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png"
                    width={150} height={150} />
                <div style={{ marginTop: "30px" }}>
                    <Circle color="#3cbc2b" size={40} />
                </div>
            </div>
        </center>
    )
}



export default Loading
