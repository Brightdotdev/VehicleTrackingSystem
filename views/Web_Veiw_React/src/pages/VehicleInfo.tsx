import React from 'react';
import type { JSX } from "react/jsx-runtime";
import { FaCheckCircle, FaHistory, FaMapMarkedAlt, FaBus } from 'react-icons/fa';
import { ArrowLeft, Notification } from 'iconsax-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavBar } from '../components/BottomNavBar';

export interface IVehiclePageProps {
  className?: string;
}

export const VehicleInfo = ({
  className,
  ...props
}: IVehiclePageProps): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className={"fixed inset-0 w-screen h-screen bg-[#f0f0f0] relative overflow-hidden " + (className || "")}>
      {/* Top center tab bar */}
      <div className="flex justify-center mt-6 mb-8 z-30 relative">
        <div className="flex rounded-lg overflow-hidden shadow">
          <button
            className={`px-8 py-2 font-semibold text-2xl focus:outline-none transition-colors duration-200 ${location.pathname === '/requests' ? 'bg-[#5852ff] text-white' : 'bg-[#484848] text-white'}`}
            style={{ borderTopLeftRadius: '0.5rem', borderBottomLeftRadius: '0.5rem' }}
            onClick={() => navigate('/requests')}
          >
            Requests
          </button>
          <button
            className={`px-8 py-2 font-semibold text-2xl focus:outline-none transition-colors duration-200 ${location.pathname === '/vehicles' ? 'bg-[#5852ff] text-white' : 'bg-[#484848] text-white'}`}
            style={{ borderTopRightRadius: '0.5rem', borderBottomRightRadius: '0.5rem' }}
            onClick={() => navigate('/vehicles')}
          >
            Vehicles
          </button>
        </div>
      </div>
      {/* Car Image Box with iconsax buttons */}
      <div className="relative w-full flex justify-center items-center" style={{height: 180}}>
        <button
          onClick={() => navigate(-1)}
          className="absolute left-8 top-8 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-[#484848] text-white hover:bg-[#222]"
          aria-label="Back"
        >
          <ArrowLeft size={24} variant="Bold" />
        </button>
        <button
          className="absolute right-8 top-8 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-[#484848] text-white"
          aria-label="Notifications"
        >
          <Notification size={22} variant="Bold" />
        </button>
        <div className="bg-[#ffffff] rounded-tl-[10px] rounded-tr-[10px] w-[1344px] h-[951px] absolute left-12 top-[52px]"></div>
        <div className="bg-[#adadad] rounded-tl-[10px] rounded-tr-[10px] w-[1344px] h-64 absolute left-12 top-12"></div>
        <div className="bg-[#484848] rounded-[50%] w-[71px] h-[71px] absolute left-[1338px] top-[33px]"></div>
        <div className="bg-[#484848] rounded-[50%] w-[71px] h-[71px] absolute left-[33px] top-[30px]"></div>
        <div className="text-[#000000] text-center font-['Inter-SemiBold',_sans-serif] text-[40px] leading-normal font-semibold absolute left-[625px] top-[146px]">
          Car Image{" "}
        </div>
        <div className="w-[158px] h-10 static">
          <div className="bg-[rgba(30,255,0,0.26)] rounded-corner-full border-solid border-[rgba(0,109,7,0.45)] border w-[158px] h-8 absolute left-[1197px] top-[346px]"></div>
          <div className="bg-[rgba(255,255,255,0.31)] rounded-[50%] border-solid border-[rgba(16,139,0,0.39)] border w-3.5 h-3.5 absolute left-[1212px] top-[355px]"></div>
          <div className="text-[#166000] text-center font-['Inter-SemiBold',_sans-serif] text-2xl leading-normal font-semibold absolute left-[1235px] top-[342px] w-[107px] h-10">
            Active{" "}
          </div>
        </div>
        <div className="text-center font-['Inter-SemiBold',_sans-serif] text-2xl leading-normal font-semibold absolute left-[133px] top-[620px]">
          <span>
            <span className="health-score-64-span">Health Score :</span>
            <span className="health-score-64-span2">64%</span>
          </span>{" "}
        </div>
        <div className="text-center font-['Inter-SemiBold',_sans-serif] text-2xl leading-normal font-semibold absolute left-[133px] top-[710px]">
          <span>
            <span className="wild-cards-none-span">Wild Cards :</span>
            <span className="wild-cards-none-span2">NONE</span>
          </span>{" "}
        </div>
        <div className="text-[#000000] text-center font-['Inter-SemiBold',_sans-serif] text-2xl leading-normal font-semibold absolute left-[127px] top-[788px]">
          Engine Type: Diesel{" "}
        </div>
        <div className="text-[#000000] text-center font-['Inter-SemiBold',_sans-serif] text-2xl leading-normal font-semibold absolute left-[130px] top-[873px]">
          Vehicle Type:Sedan{" "}
        </div>
        <div className="text-[#000000] text-center font-['Inter-SemiBold',_sans-serif] text-2xl leading-normal font-semibold absolute left-[134px] top-[441px]">
          Vehicle metadata :{" "}
        </div>
        <div className="text-[#000000] text-center font-['Inter-SemiBold',_sans-serif] text-2xl leading-normal font-semibold absolute left-[136px] top-[527px]">
          In Transit{" "}
        </div>
        <div className="bg-[#eeeeee] rounded-corner-medium w-[514px] h-[514px] absolute left-[841px] top-[431px]"></div>
        <div className="bg-[#ffffff] rounded-corner-medium w-[468px] h-[54px] absolute left-[864px] top-[447px]"></div>
        <div className="text-[#202020] text-center font-['Inter-SemiBold',_sans-serif] text-[32px] leading-normal font-semibold absolute left-[930px] top-[450px] w-[333px] h-[47px]">
          Dispatch History{" "}
        </div>
        <img
          className="rounded-none w-[390px] h-[70px] absolute left-[525px] top-[963px] overflow-visible"
          src="rectangle-120.svg"
        />
        <div className="bg-[rgba(33,63,255,0.00)] w-[3.89%] h-[5.29%] absolute right-[58.06%] left-[38.06%] bottom-[3.12%] top-[91.6%]"></div>
        <div className="bg-[#dfdfdf] rounded-corner-small w-[323px] h-14 absolute left-[593px] top-6"></div>
        <div className="bg-[rgba(0,148,22,0.13)] rounded-corner-full w-[252px] h-[46px] absolute left-[1113px] top-[241px]"></div>
        <div className="text-[#005d00] text-center font-['Inter-SemiBold',_sans-serif] text-2xl leading-normal font-semibold absolute left-[1137px] top-[247px] w-[175px] h-[33px]">
          Dispatchable{" "}
        </div>
        <div className="bg-[rgba(0,132,35,0.35)] rounded-[50%] w-[39px] h-[39px] absolute left-[1322px] top-[244px]"></div>
        <img
          className="w-[41px] h-[43px] absolute left-[1324px] top-[241px] overflow-visible"
          src="lucide-check-check0.svg"
        />
        {/* Removed failed-to-import-image icons for lucide-triangle-alert0.svg and lucide-arrow-left0.svg */}
        <div className="text-[#000000] text-center font-['Inter-SemiBold',_sans-serif] text-[40px] leading-normal font-semibold absolute left-[659px] top-5">
          Car Name{" "}
        </div>
        <div className="text-[#000000] text-center font-['Inter-SemiBold',_sans-serif] text-base leading-normal font-semibold absolute left-[899px] top-[551px] w-[212px]">
          &lcub;user&rcub;’s Dispatch request{" "}
        </div>
        <div className="text-[#000000] text-center font-['Inter-SemiBold',_sans-serif] text-base leading-normal font-semibold absolute left-[899px] top-[626px] w-[212px]">
          &lcub;user&rcub;’s Dispatch request{" "}
        </div>
        <div className="text-[#000000] text-center font-['Inter-SemiBold',_sans-serif] text-base leading-normal font-semibold absolute left-[899px] top-[709px] w-[212px]">
          &lcub;user&rcub;’s Dispatch request{" "}
        </div>
        <div className="text-[#000000] text-center font-['Inter-SemiBold',_sans-serif] text-base leading-normal font-semibold absolute left-[899px] top-[806px] w-[212px]">
          &lcub;user&rcub;’s Dispatch request{" "}
        </div>
        <img
          className="rounded-[80px] w-[2.43%] h-[3.4%] absolute right-[37.57%] left-[60%] bottom-[45.42%] top-[51.18%]"
          style={{ objectFit: "cover" }}
          src="rectangle-260.png"
        />
        <img
          className="rounded-[80px] w-[2.43%] h-[3.4%] absolute right-[37.71%] left-[59.86%] bottom-[38.24%] top-[58.36%]"
          style={{ objectFit: "cover" }}
          src="rectangle-310.png"
        />
        <img
          className="rounded-[80px] w-[2.43%] h-[3.4%] absolute right-[37.71%] left-[59.86%] bottom-[30.41%] top-[66.19%]"
          style={{ objectFit: "cover" }}
          src="rectangle-320.png"
        />
        <img
          className="rounded-[80px] w-[2.43%] h-[3.4%] absolute right-[37.71%] left-[59.86%] bottom-[21.25%] top-[75.35%]"
          style={{ objectFit: "cover" }}
          src="rectangle-330.png"
        />
        <div className="w-[158px] h-10 static">
          <div className="bg-[rgba(30,255,0,0.26)] rounded-corner-full border-solid border-[rgba(0,109,7,0.45)] border w-[158px] h-8 absolute left-[1164px] top-[546px]"></div>
          <div className="bg-[rgba(255,255,255,0.31)] rounded-[50%] border-solid border-[rgba(16,139,0,0.39)] border w-3.5 h-3.5 absolute left-[1179px] top-[555px]"></div>
          <div className="text-[#166000] text-center font-['Inter-SemiBold',_sans-serif] text-2xl leading-normal font-semibold absolute left-[1202px] top-[542px] w-[107px] h-10">
            Active{" "}
          </div>
        </div>
        <div className="w-[158px] h-[34px] static">
          <div className="bg-[rgba(166,255,0,0.26)] rounded-corner-full border-solid border-[rgba(93,109,0,0.45)] border w-[158px] h-8 absolute left-[1164px] top-[622px]"></div>
          <div className="bg-[rgba(255,255,255,0.31)] rounded-[50%] border-solid border-[rgba(106,139,0,0.39)] border w-3.5 h-3.5 absolute left-[1179px] top-[631px]"></div>
          <div className="text-[#605400] text-center font-['Inter-SemiBold',_sans-serif] text-base leading-normal font-semibold absolute left-[1198px] top-[627px] w-[107px] h-[29px]">
            COMPLETED{" "}
          </div>
        </div>
        <div className="w-[158px] h-[34px] static">
          <div className="bg-[rgba(166,255,0,0.26)] rounded-corner-full border-solid border-[rgba(93,109,0,0.45)] border w-[158px] h-8 absolute left-[1164px] top-[802px]"></div>
          <div className="bg-[rgba(255,255,255,0.31)] rounded-[50%] border-solid border-[rgba(106,139,0,0.39)] border w-3.5 h-3.5 absolute left-[1179px] top-[811px]"></div>
          <div className="text-[#605400] text-center font-['Inter-SemiBold',_sans-serif] text-base leading-normal font-semibold absolute left-[1198px] top-[807px] w-[107px] h-[29px]">
            COMPLETED{" "}
          </div>
        </div>
        <div className="w-[158px] h-8 static">
          <div className="bg-[rgba(255,0,0,0.26)] rounded-corner-full border-solid border-[rgba(109,0,0,0.45)] border w-[158px] h-8 absolute left-[1164px] top-[709px]"></div>
          <div className="bg-[rgba(255,255,255,0.31)] rounded-[50%] border-solid border-[rgba(139,0,0,0.39)] border w-3.5 h-3.5 absolute left-[1179px] top-[718px]"></div>
          <div className="text-[#600000] text-center font-['Inter-SemiBold',_sans-serif] text-base leading-normal font-semibold absolute left-[1199px] top-[713px] w-[107px] h-[23px]">
            REJECTED{" "}
          </div>
        </div>
        <div className="w-[245px] h-[39px] static">
          <div className="w-[245px] h-[39px] static">
            <div className="bg-[rgba(26,0,255,0.26)] rounded-corner-full border-solid border-[rgba(0,18,109,0.45)] border w-[245px] h-[39px] absolute left-[67px] top-[332px]"></div>
            <div className="text-[#060060] text-center font-['Inter-SemiBold',_sans-serif] text-xl leading-normal font-semibold absolute left-[119px] top-[338px] w-[165px] h-[27px]">
              CLASSIFIED{" "}
            </div>
          </div>
        </div>
        <img
          className="h-[auto] absolute left-[85px] top-[341px] overflow-visible"
          src="group-170.svg"
        />
        <img
          className="w-[37px] h-[37px] absolute left-[1355px] top-12 overflow-visible"
          src="lucide-bell0.svg"
        />
      </div>
      {/* Bottom Navigation Bar */}
      <BottomNavBar />
    </div>
  );
};

export default VehicleInfo;
