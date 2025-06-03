import axios from "axios";
import { useEffect, useState } from "react";
// import decrypt from "./helper";
import Lottie from "lottie-react";
import tickAnimation from "../../assets/tickanimation.json"
import logo from "../../assets/Logo.png"
import { Sportsdecrypt } from "./SportsAppHelper";

declare global {
    interface Window {
        Razorpay: any;
    }
}

const SportsApp = () => {

    const [loading, setLoading] = useState(true);


    const [success, setSuccess] = useState(true);

    const queryParams = new URLSearchParams(window.location.search);
    const accessdata = {
        token: queryParams.get('token') || "",
        id: queryParams.get('id') || "",
    }


    const [showModal, setShowModal] = useState<boolean>(false);

    const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

    const paymentMethod = [
        "UPI", "Credit Card", "Debit Card", "Net Banking"
    ];

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>();

    const [amount, setAmount] = useState({
        netamount: 0,
        sgst: 0,
        cgst: 0,
        addonsamount: 0.00,
        totalamount: 0
    })

    const [userdata, setUserdata] = useState({
        username: "",
        email: "",
        mobilenumber: ""
    })

    const [parsedPayload, setParsedPayload]: any = useState();

    const fetchData = async () => {


        console.log("=====>"+import.meta.env.VITE_API_SPORTS_URL)
        console.log("=====>"+import.meta.env.VITE_API_SPORTS_ENCRYTION_KEY)
        console.log("=====>"+import.meta.env.VITE_RZR_API_KEY)


        try {
            const response = await axios.post(
                `https://zadsports-admin.brightoncloudtech.com/api/v1/userRoutes/getconvertedDataAmount`,
                {
                    tempStorageId: 10,
                },
                {
                    headers: {
                        Authorization: "Bearer " + accessdata.token,
                        "Content-Type": "application/json",
                    },

                }
            )


            const data = Sportsdecrypt(
                response.data[1],
                response.data[0],
                "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
            );


            console.log(data)

            if (data.success) {

                const val = data.result[0]

                setAmount(
                    {
                        netamount: val.bookingAmount,
                        addonsamount: val.addonsAmount,
                        sgst: val.resSGSTAmount,
                        cgst: val.refCGSTAmount,
                        totalamount: val.totalAmount
                    }
                )

                const userdataval = data.profile[0]

                setUserdata({
                    username: userdataval.username,
                    email: userdataval.email,
                    mobilenumber: userdataval.mobilenumber
                })

                setParsedPayload(data.parsedPayload)
            } else {
                setSuccess(false);
            }

        } catch (e) {
            console.log(e);
        }

        setLoading(false);

    }

    useEffect(() => {

        setLoading(true);
        fetchData();

    }, [])

    useEffect(() => {
        selectedPaymentMethod && handlePayment()
    }, [selectedPaymentMethod]);

    const handlePayment = () => {
        console.log(selectedPaymentMethod);

        if (selectedPaymentMethod === "Credit Card") {
            const options = {
                key: `rzp_test_GM8j6fnLhVxq8X`,
                amount: Math.round(amount.totalamount * 100), // Razorpay requires amount in paise
                currency: "INR",
                name: "ZadSports",
                description: "Payment for services",
                handler: function (response: any) {
                    console.log(response);
                    if (response.razorpay_payment_id) {
                        setLoading(true);
                        // setShowModal(true);
                        sendPayment(response.razorpay_payment_id);
                    }
                },
                prefill: {
                    name: userdata.username,
                    email: userdata.email,
                    contact: userdata.mobilenumber,
                },
                method: {
                    upi: false,
                    card: true,
                    netbanking: false,
                    wallet: false,
                },
                theme: {
                    color: "#0377de",
                },
            };
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        }
        else if (selectedPaymentMethod === "Debit Card") {
            const options = {
                key: `rzp_test_GM8j6fnLhVxq8X`,
                amount: Math.round(amount.totalamount * 100),
                currency: "INR",
                name: "Medpredit",
                description: "Payment for Package",
                handler: function (response: any) {
                    console.log(response);
                    if (response.razorpay_payment_id) {
                        setLoading(true);
                        // setShowModal(true);
                        sendPayment(response.razorpay_payment_id);
                    }
                    // paymentToBackend(response.razorpay_payment_id, grandTotal * 100);

                    // stepperRef.current?.nextCallback();
                },
                prefill: {
                    name: userdata.username,
                    email: userdata.email,
                    contact: userdata.mobilenumber,
                },
                method: {
                    upi: false,
                    card: true,
                    netbanking: false,
                    wallet: false,
                },
                theme: {
                    color: "#0377de",
                },
            };
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } else if (selectedPaymentMethod === "UPI") {
            const options = {
                key: `rzp_test_GM8j6fnLhVxq8X`,
                amount: Math.round(amount.totalamount * 100),
                currency: "INR",
                name: "Medpredit",
                description: "Payment for Package",
                handler: function (response: any) {
                    console.log(response);
                    if (response.razorpay_payment_id) {
                        setLoading(true);
                        // setShowModal(true);
                        sendPayment(response.razorpay_payment_id);
                    }
                    // paymentToBackend(response.razorpay_payment_id, grandTotal * 100);

                    // stepperRef.current?.nextCallback();
                },
                prefill: {
                    name: userdata.username,
                    email: userdata.email,
                    contact: userdata.mobilenumber,
                },
                method: {
                    upi: true,
                    card: false,
                    netbanking: false,
                    wallet: false,
                },
                theme: {
                    color: "#0377de",
                },
            };
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } else if (selectedPaymentMethod === "Net Banking") {
            const options = {
                key: `rzp_test_GM8j6fnLhVxq8X`,
                amount: Math.round(amount.totalamount * 100),
                currency: "INR",
                name: "Medpredit",
                description: "Payment for Package",
                handler: function (response: any) {
                    console.log(response);
                    if (response.razorpay_payment_id) {
                        setLoading(true);
                        // setShowModal(true);
                        sendPayment(response.razorpay_payment_id);
                    }
                    // paymentToBackend(response.razorpay_payment_id, grandTotal * 100);

                    // stepperRef.current?.nextCallback();
                },
                prefill: {
                    name: userdata.username,
                    email: userdata.email,
                    contact: userdata.mobilenumber,
                },
                method: {
                    upi: false,
                    card: false,
                    netbanking: true,
                    wallet: false,
                },
                theme: {
                    color: "#0377de",
                },
            };
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        }
    };

    const sendPayment = async (razor_payment_id: string) => {
        console.log(razor_payment_id);
        const response = await axios.post(`https://zadsports-admin.brightoncloudtech.com/api/v1/userRoutes/userGroundBooking`,
            {
                refGroundId: parsedPayload.refGroundId,
                isAddonNeeded: parsedPayload.isAddonNeeded,
                refBookingTypeId: parsedPayload.refBookingTypeId,
                refBookingStartDate: parsedPayload.refBookingStartDate,
                refBookingEndDate: parsedPayload.refBookingEndDate,
                additionalNotes: parsedPayload.additionalNotes,
                refAddOns: parsedPayload.refAddOns,
                transactionId: razor_payment_id
            },
            {
                headers: {
                    Authorization: "Bearer " + accessdata.token,
                    "Content-Type": "application/json",
                },

            })

        const data = Sportsdecrypt(
            response.data[1],
            response.data[0],
            "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        );

        console.log(data)

        // localStorage.setItem("token", "Bearer " + data.token)

        if (data.success) {

            setLoading(false);
            setShowModal(true);

        }
    };

    return (

        <div style={{ width: "100%", height: "100vh", backgroundColor: "#f9fff7", fontFamily: "Poppins" }}>
            {
                loading ? (
                    <>
                        <div className="w-[100%] h-[100vh] flex justify-center items-center">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-labelledby="title-04a desc-04a"
                                aria-live="polite"
                                aria-busy="true"
                                className="animate h-10 w-10 animate-spin"
                            >
                                <title id="title-04a">Icon title</title>
                                <desc id="desc-04a">Some desc</desc>
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    className="stroke-slate-200"
                                    strokeWidth="4"
                                />
                                <path
                                    d="M12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 9.34784 20.9464 6.8043 19.0711 4.92893C17.1957 3.05357 14.6522 2 12 2"
                                    className="stroke-[#0377de]"
                                    strokeWidth="4"
                                />
                            </svg>
                        </div>
                    </>
                ) : (
                    <>

                        <>

                            {
                                success ? (
                                    <>
                                        {
                                            showModal && (
                                                <>
                                                    <div
                                                        className="fixed top-0 left-0 z-20 flex items-center justify-center w-screen h-screen bg-slate-700/50 backdrop-blur-sm"
                                                        aria-labelledby="header-3a content-3a"
                                                        aria-modal="true"
                                                        role="dialog"
                                                    >
                                                        <div
                                                            className="flex max-h-[90vh] w-11/12 max-w-xl flex-col gap-6 overflow-hidden rounded-lg bg-white p-0 text-slate-500 shadow-xl shadow-slate-700/10"
                                                            role="document"
                                                        >
                                                            <div className="modalContent py-[10px]">
                                                                <div className="lottie-container w-[100%] flex justify-center items-center">
                                                                    <Lottie
                                                                        animationData={tickAnimation}
                                                                        loop={false}
                                                                        style={{ width: 150, height: 150 }}
                                                                        onComplete={() =>
                                                                            setTimeout(() => {
                                                                                setShowModal(false);
                                                                                setSuccess(false);
                                                                                window.location.href = "zadsports://open/bookinghistory";
                                                                                // history.replace("/subscriptionPlans", { refreshPage: true });
                                                                            }, 1000)
                                                                        }
                                                                    />
                                                                </div>
                                                                <p
                                                                    className="w-[100%] flex justify-center font-[poppins]"
                                                                    style={{
                                                                        fontWeight: "700",
                                                                        fontSize: "x-large",
                                                                        marginTop: "0%",
                                                                    }}
                                                                >
                                                                    Payment Successful
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        }




                                        {
                                            showPaymentModal && (
                                                <>
                                                    <div
                                                        style={{ fontFamily: "Poppins" }}
                                                        className="fixed top-0 left-0 z-20 flex items-center justify-center w-screen h-screen bg-slate-700/50 backdrop-blur-sm"
                                                        aria-labelledby="header-3a content-3a"
                                                        aria-modal="true"
                                                        role="dialog"
                                                    >
                                                        <div
                                                            className="flex max-h-[90vh] w-11/12 max-w-xl flex-col gap-6 overflow-hidden rounded-lg bg-white p-2 text-slate-500 shadow-xl shadow-slate-700/10"
                                                            role="document"
                                                        >
                                                            <header id="header-3a" className="flex items-center gap-4">
                                                                <h3 className="flex-1 text-xl font-medium text-slate-700">
                                                                    Payment Method
                                                                </h3>
                                                                <button
                                                                    onClick={() => setShowPaymentModal(false)}
                                                                    className="inline-flex items-center justify-center h-8 gap-2 px-5 text-sm font-medium tracking-wide transition duration-300 rounded-full justify-self-center whitespace-nowrap text-[#0377de] hover:bg-emerald-100 hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-emerald-300 disabled:shadow-none disabled:hover:bg-transparent"
                                                                    aria-label="close dialog"
                                                                >
                                                                    <span className="relative only:-mx-5">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            className="w-5 h-5"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="currentColor"
                                                                            strokeWidth="1.5"
                                                                            role="graphics-symbol"
                                                                            aria-labelledby="title-79 desc-79"
                                                                        >
                                                                            <title id="title-79">Icon title</title>
                                                                            <desc id="desc-79">
                                                                                A more detailed description of the icon
                                                                            </desc>
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                d="M6 18L18 6M6 6l12 12"
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                </button>
                                                            </header>

                                                            <div className="mt-[-10px]">
                                                                {paymentMethod.map((method) => (
                                                                    <div
                                                                        className="text-[1rem] font-semibold p-2 border-2 rounded mb-2"
                                                                        onClick={() => {
                                                                            setSelectedPaymentMethod(method);
                                                                            setShowPaymentModal(false);
                                                                        }}
                                                                        key={method}
                                                                    >
                                                                        <p>{method}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        }

                                        <div className="w-[100%] h-[100vh] ">
                                            <div style={{ width: "100%", padding: "5px 20px" }}>
                                                <div className="px-[2rem] py-[1rem]" style={{ fontSize: "1rem", fontFamily: "Poppins", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#000" }}>
                                                    <img src={logo} style={{ height: "60px" }} alt="Logo" />
                                                    <div>Payment</div>
                                                </div>
                                            </div>

                                            <div className="px-[1rem]">
                                                <div className="w-[100%] bg-[#e9f3fe] my-[10px] p-[10px] rounded-[10px] ">
                                                    <div className="flex justify-between">
                                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                                            Ground Booking Amount
                                                        </div>
                                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                                            ₹&nbsp;{
                                                                amount.netamount
                                                            }

                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between my-[5px]">
                                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                                            Addons Amount
                                                        </div>
                                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                                            ₹&nbsp;{
                                                                amount.addonsamount
                                                            }

                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between my-[5px]">
                                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                                            SGST (9%)
                                                        </div>
                                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                                            ₹&nbsp;{
                                                                amount.sgst
                                                            }

                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between mb-[5px]">
                                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                                            CGST (9%)
                                                        </div>
                                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                                            ₹&nbsp;{
                                                                amount.cgst
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                                            Total Payable Amount
                                                        </div>
                                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                                            ₹&nbsp;{
                                                                amount.totalamount
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ position: "fixed", bottom: "0px", width: "100%", height: "9vh", padding: "0px 20px", display: "flex", justifyContent: "center", alignItems: "center", }}>
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        height: "6vh",
                                                        background: "#0377de",
                                                        color: "#fff",
                                                        borderRadius: "10px"
                                                    }}
                                                >
                                                    <button
                                                        onClick={() => {
                                                            setSelectedPaymentMethod("");
                                                            setShowPaymentModal(true);
                                                        }}
                                                        style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "6vh", fontWeight: 600 }}
                                                        className="medCustom-button02"
                                                    >
                                                        Proceed Payment
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <><div className="font-[poppins] text-[0.9rem] h-[100vh] w-[100%] px-[1rem] flex flex-col items-center text-center">
                                        <div style={{ width: "100%", padding: "5px 20px" }}>
                                            <div className="px-[2rem] py-[1rem]" style={{ fontSize: "1rem", fontFamily: "Poppins", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#000" }}>
                                                <img src={logo} style={{ height: "60px" }} alt="Logo" />
                                                <div>Payment</div>
                                            </div>
                                        </div>
                                        <div className="bg-[#e9f3fe] my-[10px] p-[10px] rounded-[10px]">
                                            This link has expired or the payment has already been completed. Please check the app for more details.
                                        </div>
                                    </div></>
                                )
                            }

                        </>
                    </>
                )
            }
        </div>
    )
}

export default SportsApp