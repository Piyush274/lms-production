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

const ChartData = ({ goal,data }) => {
    const [chartWidth, setChartWidth] = useState(null);
    const [GoalChartWidth, setGoalChartWidth] = useState(null);

    const options = useMemo(
        () =>
            goal
                ? createRadialOptionsGoal("#2A36A6", "#E2E5FE")
                : createRadialOptions("#2A36A6", "#E2E5FE"),
        []
    );
    const optionsA = useMemo(
        () =>
            goal
                ? createRadialOptionsGoal("#5EA12A", "#DEEDD2")
                : createRadialOptions("#5EA12A", "#DEEDD2"),
        []
    );
    const optionsB = useMemo(
        () =>
            goal
                ? createRadialOptionsGoal("#C71B97", "#F4DBED")
                : createRadialOptions("#C71B97", "#F4DBED"),
        []
    );

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1920)
                setChartWidth(230), setGoalChartWidth(280);
            else if (window.innerWidth > 1400)
                setChartWidth(200), setGoalChartWidth(280);
            else if (window.innerWidth > 992)
                setChartWidth(270), setGoalChartWidth(250);
            else if (window.innerWidth > 400)
                setChartWidth(210), setGoalChartWidth(250);
            else if (window.innerWidth > 375)
                setChartWidth(210), setGoalChartWidth(250);
            else setChartWidth(210), setGoalChartWidth(250);
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const cardsData = [
        {
            img: icons?.pstarImg,
            count: data?. activeSkillsCount ||0,
            name: "Active Skills",
            series: [16],
            options,
            bgColor: "#f1f3ff",
        },
        {
            img: icons?.gstarImg,
            count: data?.completedSkillsCount ||0,
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
    const cardGoal = [
        {
            img: icons?.targetImg,
            action: "In progress",
            series: [16],
            options,
            bgColor: "#f1f3ff",
            titleBg: "#2A36A629",
            textColor: "#2A36A6",
            title: "Compose an original song",
        },
        {
            img: icons?.targetGImg,
            action: "In progress",
            series: [70],
            options: optionsA,
            bgColor: "#f3faed",
            titleBg: "#5EA12A29",
            textColor: "#5EA12A",
            title: "Learn a new song every week",
        },
        {
            img: icons?.targetPImg,
            action: "In progress",
            series: [16],
            options: optionsB,
            bgColor: "#ffeefa",
            titleBg: "#C71B9729",
            textColor: "#C71B97",
            title: "I want to perform",
        },
    ];
    const graphDiv = goal ? cardGoal : cardsData;


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
                            action,
                            titleBg,
                            textColor,
                            title,
                            count,
                            name,
                        },
                        index
                    ) => (
                        <div
                            className={`${goal ? "col-div-1" : "col-div"}`}
                            key={index}>
                            {goal ? (
                                <div
                                    className="card-goal"
                                    style={{ backgroundColor: bgColor }}>
                                    <div className="goal-img">
                                        <img
                                            src={img}
                                            alt="img-target"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div
                                        className="chart-div"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}>
                                        <ReactApexChart
                                            options={options}
                                            series={series}
                                            type="radialBar"
                                            width={`${GoalChartWidth}px`}
                                        />
                                    </div>
                                    <div
                                        className="action-text"
                                        style={{
                                            backgroundColor: titleBg,
                                            color: textColor,
                                        }}>
                                        {action}
                                    </div>
                                    <h5 className="title-text">{title}</h5>
                                </div>
                            ) : (
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
                            )}
                        </div>
                    )
                )}
                {goal && (
                    <div className="col-div-half pointer">
                        <div
                            className="cart-card-1"
                            style={{ backgroundColor: " #FFF3EF" }}>
                            <div className="left-div">
                                <div className="img-div-a">
                                    <img
                                        src={icons?.addRoundImg}
                                        alt="goal-img"
                                        loading="lazy"
                                    />
                                </div>
                                <h5 className="goal-name">Add new goal</h5>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ChartData;
