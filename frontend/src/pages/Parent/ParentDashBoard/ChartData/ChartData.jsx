import { icons } from "@/utils/constants";
import "./ChartData.scss";
import ReactApexChart from "react-apexcharts";
import { useEffect, useState, useMemo } from "react";


const createRadialOptions = (color, background) => ({
    chart: {
        type: "radialBar",
        toolbar: { show: false },
    },
    plotOptions: {
        radialBar: {
            inverseOrder: false,
            startAngle: -170,
            endAngle: 200,
            hollow: {
                margin: 5,
                size: "50%",
                background: "transparent",
                position: "front",
            },
            track: { show: true, background, strokeWidth: "97%", margin: 5 },
            dataLabels: {
                name: {
                    show: false,
                },
                show: true,
                value: {
                    formatter: (val) => `${parseInt(val)}%`,
                    color,
                    fontSize: "37px",
                    offsetY: 15,
                    fontFamily: "GilroySemiBold",
                    textAnchor: "middle",
                },
            },
        },
    },
    fill: { type: "solid", colors: [color] },
    stroke: { lineCap: "round" },
});
const createRadialOptionsGoal = (color, background) => ({
    chart: {
        type: "radialBar",
        toolbar: { show: false },
    },
    plotOptions: {
        radialBar: {
            inverseOrder: false,
            startAngle: -170,
            endAngle: 200,
            hollow: {
                margin: 5,
                size: "50%",
                background: "transparent",
                position: "front",
            },
            track: { show: true, background, strokeWidth: "97%", margin: 12 },
            dataLabels: {
                name: {
                    show: false,
                },
                show: true,
                value: {
                    formatter: (val) => `${parseInt(val)}%`,
                    color,
                    fontSize: "37px",
                    offsetY: 15,
                    fontFamily: "GilroySemiBold",
                    textAnchor: "middle",
                },
            },
        },
    },
    fill: { type: "solid", colors: [color] },
    stroke: { lineCap: "round" },
});

const ChartData = ({data}) => {
    const [chartWidth, setChartWidth] = useState(null);
  

    const options = useMemo(
        () =>
           
                 createRadialOptions("#2A36A6", "#E2E5FE"),
        []
    );
    const optionsA = useMemo(
        () =>
          
                 createRadialOptions("#5EA12A", "#DEEDD2"),
        []
    );
    const optionsB = useMemo(
        () =>
          
                 createRadialOptions("#C71B97", "#F4DBED"),
        []
    );

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1920)
                setChartWidth(230)
            else if (window.innerWidth > 1400)
                setChartWidth(200)
            else if (window.innerWidth > 992)
                setChartWidth(250)
            else if (window.innerWidth > 400)
                setChartWidth(210)
            else if (window.innerWidth > 375)
                setChartWidth(210)
            else setChartWidth(210)
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

 
    const cardsData = [
        {
            img: icons?.pstarImg,
            count: data?.activeSkillsCount,
            name: "Active Skills",
            series: [16],
            options,
            bgColor: "#f1f3ff",
        },
        {
            img: icons?.gstarImg,
            count: data?.completedSkillsCount,
            name: "Completed Skills",
            series: [70],
            options: optionsA,
            bgColor: "#f3faed",
        },
        {
            img: icons?.pcalenderImg,
            count: 1,
            name: "Events",
            series: [90],
            options: optionsB,
            bgColor: "#ffeefa",
        },
    ];
    // const cardGoal = [
    //     {
    //         img: icons?.targetImg,
    //         action: "In progress",
    //         series: [16],
    //         options,
    //         bgColor: "#f1f3ff",
    //         titleBg: "#2A36A629",
    //         textColor: "#2A36A6",
    //         title: "Compose an original song",
    //     },
    //     {
    //         img: icons?.targetGImg,
    //         action: "In progress",
    //         series: [70],
    //         options: optionsA,
    //         bgColor: "#f3faed",
    //         titleBg: "#5EA12A29",
    //         textColor: "#5EA12A",
    //         title: "Learn a new song every week",
    //     },
    //     {
    //         img: icons?.targetPImg,
    //         action: "In progress",
    //         series: [16],
    //         options: optionsB,
    //         bgColor: "#ffeefa",
    //         titleBg: "#C71B9729",
    //         textColor: "#C71B97",
    //         title: "I want to perform",
    //     },
    // ];
    const graphDiv =  cardsData;
    return (
        <section className="chart-container">
            <div className="row-div">
                {graphDiv?.map(
                    (
                        {
                            img,
                            series,
                            options,
                            bgColor,
                            // action,
                            // titleBg,
                            // textColor,
                            // title,
                            count,
                            name,
                        },
                        index
                    ) => (
                        <div
                            className={ "col-div"}
                            key={index}>
                          
                                <div
                                    className={`cart-card `}
                                    style={{ backgroundColor: bgColor }}>
                                    <div className="left-div">
                                        <div className="img-div">
                                            <img
                                                src={img}
                                                alt={`${name}-img`}
                                                loading="lazy"
                                            />
                                        </div>
                                        <h3 className="cart-count">{count}</h3>
                                        <h5 className="skill-name">{name}</h5>
                                    </div>
                                    <div className="right-div">
                                        <ReactApexChart
                                            options={options}
                                            series={series}
                                            type="radialBar"
                                            width={`${chartWidth}px`}
                                        />
                                    </div>
                                </div>
                          
                        </div>
                    )
                )}
             
            </div>
        </section>
    );
};

export default ChartData;
