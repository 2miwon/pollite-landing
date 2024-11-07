<script lang="ts">
    import { onMount } from 'svelte';
    import axios from 'axios';
    import { writable } from 'svelte/store';
	import { ConsoleLogWriter } from 'drizzle-orm';

    const addrScript = "https://script.google.com/macros/s/AKfycbzKMbePd_alOjtPPjIqdsNcs9gj3ym3lwjLaL9yLyU9AdSwc9_2oaIfvePK3phI4rK2nw/exec";
    let ip = "unknown";

    // 쿠키에서 값을 가져오는 함수
    function getCookieValue(name: string) {
		const value = "; " + document.cookie;
		const parts = value.split("; " + name + "=");
		if (parts.length === 2) {
            const part = parts.pop();
            if (part) {
                return part.split(";").shift();
            }
		}
    }

    // 쿠키에 값을 저장하는 함수
    function setCookieValue(name: string, value: string, days: number) {
		let expires = "";
		if (days) {
			const date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + (value || "") + expires + "; path=/";
	}
	
    function getUVfromCookie() {
    	// 6자리 임의의 문자열 생성
    	const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
    	// 쿠키에서 기존 해시 값을 가져옴
    	const existingHash = getCookieValue("user");
    	// 기존 해시 값이 없으면, 새로운 해시 값을 쿠키에 저장
    	if (!existingHash) {
    		setCookieValue("user", hash, 180); // 쿠키 만료일은 6개월 
    		return hash;
    	} else {
    		// 기존 해시 값이 있으면, 기존 값을 반환
    		return existingHash;
    	}
    }

    function padValue(value: number) {
		return (value < 10) ? "0" + value : value;
	}

    function getTimeStamp() {
		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();
		const formattedDate = `${padValue(year)}-${padValue(month)}-${padValue(day)} ${padValue(hours)}:${padValue(minutes)}:${padValue(seconds)}`;
		return formattedDate;
	}

    function getUTM() {
        var queryString = location.search;
		const urlParams = new URLSearchParams(queryString);
		const utm = urlParams.get("utm")
        return utm ? utm : 'unknown';
    }

    function getDevice() {
	    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
	    	// true for mobile device
	    	return 'mobile';
	    } else {
        	// false for not mobile device
        	return 'desktop';
        }
    }

    // function getTimeStamp(): string {
    //     const date = new Date();
    //     const options: Intl.DateTimeFormatOptions = {
    //         year: 'numeric',
    //         month: '2-digit',
    //         day: '2-digit',
    //         hour: '2-digit',
    //         minute: '2-digit',
    //         second: '2-digit',
    //         hour12: false
    //     };
    //     return new Intl.DateTimeFormat('ko-KR', options).format(date).replace(/\./g, '-').replace(' ', 'T');
    // }

    function validateEmail(email: string) {
	    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	    return re.test(email);
	}

    const job = writable("");
    const email = writable("");
    const advice = writable("");

    async function handleSubmit() {
        let emailValue = '';
        let adviceValue = '';
        let jobValue = '';

        email.subscribe(value => emailValue = value);
        advice.subscribe(value => adviceValue = value);
        job.subscribe(value => jobValue = value);

        if (emailValue === '' || !validateEmail(emailValue)) {
            alert("이메일이 유효하지 않아 알림을 드릴 수가 없습니다.");
            return;
        }

        const finalData = JSON.stringify({
            "id": getUVfromCookie(),
            "email": emailValue,
            "advice": jobValue + "-" + adviceValue
        });
        console.log("finalData - ", finalData);
        try {
            const response = await axios.get(`${addrScript}?action=insert&table=tab_final&data=${encodeURIComponent(finalData)}`);
            console.log(response.data.data);
            // alert(JSON.stringify(response));
        } catch (error) {
            console.error('데이터 전송 중 오류 발생:', error);
        }
    }

    onMount(async () => {
        try {
            const response = await axios.get('https://jsonip.com');
            ip = response.data.ip;
        } catch (error) {
            console.error('IP 주소를 가져오는 중 오류 발생:', error);
            ip = 'unknown';
        }

        var data = JSON.stringify({
            "id": getUVfromCookie(),
	        "landingUrl": window.location.href,
	        "ip": ip,
	        "referer": document.referrer,
	        "time_stamp": getTimeStamp(), 
	        "utm": getUTM(),
	        "device": getDevice(),
        });

        console.log('data - ', data);
        console.log(`${addrScript}?action=insert&table=tab_master&data=${encodeURIComponent(data)}`);
        console.log('parsed - ', JSON.parse( data ));
        axios.get(`${addrScript}?action=insert&table=tab_master&data=${encodeURIComponent(data)}`)
            .then(response => {
                console.log('성공 - ', response.data);
            })
            .catch(error => {
                console.log('실패 - ', JSON.stringify(error));
            });
    });

</script>

<section id="next" class="w-full flex justify-center py-[100px]">
    <div class="lg:max-w-[906px] 2xl:max-w-[1300px] w-full flex flex-col items-center">
        <div class="text-center">
            <h4 class="md:w-fit md:font-bold md:font-[&quot;Pretendard&quot;] md:leading-[130%] md:text-[36px] w-fit font-bold font-[&quot;Pretendard&quot;] leading-[130%] text-[36px] text-black md:text-black hidden lg:block">
                법률 전문가를 위한 최첨단 AI 파트너
            </h4>
            <h1 class="md:w-fit md:font-semibold md:font-[&quot;Pretendard&quot;] md:leading-[1.3] md:text-[24px] w-fit font-semibold font-[&quot;Pretendard&quot;] leading-[1.3] text-[24px] text-primary900 md:text-primary900 lg:hidden">
                <p class="leading-[130%] font-bold">법률 전문가를 위한</p><p class="leading-[130%] font-bold">최첨단 AI 파트너</p>
            </h1>
            <h3 class="md:w-fit md:font-semibold md:font-[&quot;Pretendard&quot;] md:leading-[1.3] md:text-[18px] w-fit font-semibold font-[&quot;Pretendard&quot;] leading-[1.3] text-[18px] text-gray700 md:text-gray700 mt-[12px] font-medium hidden lg:inline-block">
                정확성과 효율성의 새로운 기준을 제시합니다
            </h3>
        </div>
        <ul class="flex justify-around w-full mt-[40px] lg:justify-between lg:mt-[60px] lg:w-[700px] false opacity-100 duration-[0.5s] transition-all">
            <li class="flex flex-col items-center w-[90px] lg:w-[180px]">
                <span class="text-[32px] lg:text-[64px] font-bold leading-[130%] text-primary900 lg:text-black">
                    99.8%
                </span>
                <p class="text-[12px] lg:text-[18px] font-normal lg:font-medium leading-[150%] text-gray500 text-center whitespace-pre-line">
                    법률 문서<br>정확도
                </p>
            </li>
            <li class="flex flex-col items-center w-[90px] lg:w-[180px]">
                <span class="text-[32px] lg:text-[64px] font-bold leading-[130%] text-primary900 lg:text-black">
                    0.1초
                </span>
                <p class="text-[12px] lg:text-[18px] font-normal lg:font-medium leading-[150%] text-gray500 text-center whitespace-pre-line">
                    실시간<br>검색시간
                </p>
            </li>
            <li class="flex flex-col items-center w-[90px] lg:w-[180px]">
                <span class="text-[32px] lg:text-[64px] font-bold leading-[130%] text-primary900 lg:text-black">
                    74만
                </span>
                <p class="text-[12px] lg:text-[18px] font-normal lg:font-medium leading-[150%] text-gray500 text-center whitespace-pre-line">
                    법령정보<br>데이터 보유
                </p>
            </li>
        </ul>
    </div>
</section>

<section class="w-full flex justify-center py-[80px] lg:pt-[59px] 2xl:pt-[130px] px-[20px] lg:px-0 lg:overflow-x-auto">
    <div class="lg:max-w-[906px] 2xl:max-w-[1300px] w-full flex flex-col justify-center items-start gap-[20px]">
        <section>
            <span class="md:font-[&quot;Pretendard&quot;] md:leading-[1.5] md:text-[16px] md:font-[700] font-[&quot;Pretendard&quot;] leading-[1.5] text-[14px] font-[700] text-primary900 md:text-primary900">
                저희 기업만의 솔루션이 궁금하신가요?
            </span>
            <p class="pt-[4px] pb-[16px] text-[27px] lg:text-[36px] leading-[130%] font-bold text-primary900 lg:py-[12px]">
                당신의 법률 업무에 
                <br class="lg:hidden">
                혁신적인 변화를
            </p>
            <span class="md:font-[&quot;Pretendard&quot;] md:leading-[1.5] md:text-[16px] md:font-[400] font-[&quot;Pretendard&quot;] leading-[1.5] text-[14px] font-[400] text-primary900 md:text-primary900">
                업무 프로세스를 완벽히 반영한 맞춤형 AI 솔루션을 제공합니다.<br>더욱 생산적이고 전략적으로 업무를 수행할 수 있도록 지원하겠습니다.
            </span>
        </section>
        <section class="w-full my-[32px] lg:mt-[50px]">
            <div class="lg:max-w-[906px] 2xl:max-w-[1300px] mt-[25px] lg:h-fit grid grid-rows-5 gap-y-[40px] md:grid-cols-5 lg:gap-x-[8px] 2xl:gap-x-[15px] md:gap-y-0 md:grid-rows-none" style="opacity: 1;">
                <article class="w-full h-[48px] px-[16px] py-[8px] lg:h-full lg:px-[20px] lg:py-[25px] rounded-[4px] bg-[#FFFFFF80] break-all 2xl:min-h-[197px]" data-projection-id="3" style="opacity: 1; transform: none;">
                    <span class="md:font-[&quot;Pretendard&quot;] md:leading-[1.5] md:text-[16px] md:font-[700] font-[&quot;Pretendard&quot;] leading-[1.5] text-[14px] font-[500] text-primary900 md:text-primary900 !xl:text-[14px]">
                        정확한 판례 분석
                    </span>
                    <br class="flex lg:hidden">
                    <span class="md:font-[&quot;Pretendard&quot;] md:leading-[1.5] md:text-[14px] md:font-[400] font-[&quot;Pretendard&quot;] leading-[1.5] text-[14px] font-[400] text-primary md:text-primary lg:block pt-[18px]">
                        AI가 정확한 유사 판례를 찾아 <br class="flex md:hidden"> 승소 전략을 제시합니다
                    </span>
                </article>
                <article class="w-full h-[48px] px-[16px] py-[8px] lg:h-full lg:px-[20px] lg:py-[25px] rounded-[4px] bg-[#FFFFFF80] break-all 2xl:min-h-[197px]" data-projection-id="4" style="opacity: 1; transform: none;">
                    <span class="md:font-[&quot;Pretendard&quot;] md:leading-[1.5] md:text-[16px] md:font-[700] font-[&quot;Pretendard&quot;] leading-[1.5] text-[14px] font-[500] text-primary900 md:text-primary900 !xl:text-[14px]">
                        지능형 문서 자동화
                    </span>
                    <br class="flex lg:hidden">
                    <span class="md:font-[&quot;Pretendard&quot;] md:leading-[1.5] md:text-[14px] md:font-[400] font-[&quot;Pretendard&quot;] leading-[1.5] text-[14px] font-[400] text-primary md:text-primary lg:block pt-[18px]">
                        표준화된 계약서 작성에 <br class="flex md:hidden"> 더 이상 시간을 낭비하지 마세요. 
                    </span>
                </article>
                <article class="w-full h-[48px] px-[16px] py-[8px] lg:h-full lg:px-[20px] lg:py-[25px] rounded-[4px] bg-[#FFFFFF80] break-all 2xl:min-h-[197px] !break-keep" data-projection-id="5" style="opacity: 1; transform: none;">
                    <span class="md:font-[&quot;Pretendard&quot;] md:leading-[1.5] md:text-[16px] md:font-[700] font-[&quot;Pretendard&quot;] leading-[1.5] text-[14px] font-[500] text-primary900 md:text-primary900 !xl:text-[14px]">
                        신규 법률 동향 분석
                    </span>
                    <br class="flex lg:hidden">
                    <span class="md:font-[&quot;Pretendard&quot;] md:leading-[1.5] md:text-[14px] md:font-[400] font-[&quot;Pretendard&quot;] leading-[1.5] text-[14px] font-[400] text-primary md:text-primary lg:block pt-[18px]">
                        매일매일 업데이트되는 법의안과 판례를 <br class="flex md:hidden"> 실시간으로 분석합니다.
                    </span>
                </article>
                <article class="w-full h-[48px] px-[16px] py-[8px] lg:h-full lg:px-[20px] lg:py-[25px] rounded-[4px] bg-[#FFFFFF80] break-all 2xl:min-h-[197px]" data-projection-id="6" style="opacity: 1; transform: none;">
                    <span class="md:font-[&quot;Pretendard&quot;] md:leading-[1.5] md:text-[16px] md:font-[700] font-[&quot;Pretendard&quot;] leading-[1.5] text-[14px] font-[500] text-primary900 md:text-primary900 !xl:text-[14px]">
                        법률 리서치 지원
                    </span>
                    <br class="flex lg:hidden">
                    <span class="md:font-[&quot;Pretendard&quot;] md:leading-[1.5] md:text-[14px] md:font-[400] font-[&quot;Pretendard&quot;] leading-[1.5] text-[14px] font-[400] text-primary md:text-primary lg:block pt-[18px]">
                        방대한 법령과 판례의 상호 참조를 <br class="flex md:hidden"> 자동으로 분석합니다.
                    </span>
                </article>
                <article class="w-full h-[64px] px-[16px] py-[8px] lg:h-full lg:px-[20px] lg:py-[25px] rounded-[4px] bg-[#FFFFFF80] break-all 2xl:min-h-[197px]" data-projection-id="7" style="opacity: 1; transform: none;">
                    <span class="md:font-[&quot;Pretendard&quot;] md:leading-[1.5] md:text-[16px] md:font-[700] font-[&quot;Pretendard&quot;] leading-[1.5] text-[14px] font-[500] text-primary900 md:text-primary900 !xl:text-[14px]">
                        컴플라이언스 관리
                    </span>
                    <br class="flex lg:hidden">
                    <span class="md:font-[&quot;Pretendard&quot;] md:leading-[1.5] md:text-[14px] md:font-[400] font-[&quot;Pretendard&quot;] leading-[1.5] text-[14px] font-[400] text-primary md:text-primary lg:block pt-[18px]">
                        규제 준수 현황을 실시간으로 진단하고, <br class="flex md:hidden"> 법적 리스크를 최소화합니다.
                    </span>
                </article>
            </div>
        </section>
        <section class="flex w-full items-center justify-center mt-[24px] mb-[32px] lg:my-[40px] 2xl:mt-[70px] 2xl:mb-[62px]">
            <div class="inline-grid grid-rows-3 mx-auto items-center justify-center gap-x-[8px] gap-y-[16px] lg:grid-cols-1 lg:gap-y-[12px] p-[25px] border rounded-xl shadow-xl">
                <article class="flex items-center justify-center gap-[10px] lg:gap-[20px]">
                    <p class="flex items-center w-[120px] h-[48px] rounded-md lg:w-[180px] px-[8px] text-[14px] lg:text-[20px] font-bold text-white bg-primary">
                        직업군
                    </p>
                    <input 
                        class="w-full h-[36px] md:h-[48px] rounded-lg lg:w-[732px] px-[8px] text-[14px] lg:text-[13px] text-black bg-[#FFFFFF] lg:bg-[#F8F8F8] max-w-[300px]" 
                        type="text" 
                        placeholder="변호사, 법무사, 공무원, 로스쿨생, 기타 등"
                        bind:value={$job}
                    />
                </article>
                <article class="flex items-center justify-center gap-[10px] lg:gap-[20px]">
                    <p class="flex items-center w-[120px] h-[48px] rounded-md lg:w-[180px] px-[8px] text-[14px] lg:text-[20px] font-bold text-white bg-primary">
                        이메일 주소
                    </p>
                    <input 
                        class="w-full h-[36px] md:h-[48px] rounded-lg lg:w-[732px] px-[8px] text-[14px] lg:text-[13px] text-black bg-[#FFFFFF] lg:bg-[#F8F8F8] max-w-[300px]" 
                        type="text" 
                        placeholder="example@domain.com"
                        bind:value={$email}
                    />
                </article>
                <article class="flex items-center justify-center gap-[10px] lg:gap-[20px]">
                    <p class="flex items-center w-[120px] h-[48px] rounded-md lg:w-[180px] px-[8px] text-[14px] lg:text-[20px] font-bold text-white bg-primary">
                        바라는 점
                    </p>
                    <input class="w-full h-[36px] md:h-[48px] rounded-lg lg:w-[732px] px-[8px] text-[14px] lg:text-[13px] text-black bg-[#FFFFFF] lg:bg-[#F8F8F8] max-w-[300px]" 
                        type="text" 
                        placeholder="저희 서비스에 대해 바라는점을 자유롭게 작성해주세요"
                        bind:value={$advice}    
                    />
                </article>
            </div>
        </section>
        <section class="w-full flex justify-center mb-[64px] lg:mb-[90px]">
            <button 
                type="button" 
                class="w-fit h-[44px] p-[12px] flex justify-between items-center text-center rounded-[4px] text-[14px] font-bold leading-[150%] lg:h-[55px] lg:pl-[24px] lg:pr-[20px] lg:py-[12px] lg:text-[20px] lg:font-semibold text-primary900 bg-[#E0E0E088] hover:bg-[#E0E0E0B3] shadow-lg"
                on:click={handleSubmit}
                >
                제출하고 1달 무료체험하기
                <div class="w-[18px] h-[18px] ml-[10px] lg:w-[30px] lg:h-[30px] object-cover">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 18 19" fill="none">
                        <path d="M10.125 4.28198L15.75 9.90698M15.75 9.90698L10.125 15.532M15.75 9.90698H2.25" stroke="#063B43" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </div>
            </button>
        </section>
    </div>
</section>