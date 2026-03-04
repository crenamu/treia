// Treia_H1_Monthly_Base_Exporter.mq5
#property copyright "Treia AI Master"
#property version   "1.00"
#property strict
#property script_show_inputs // 스크립트 실행 시 팝업창을 띄워 변수 선택 가능

// 사용자가 추출할 개월 수를 외부 변수로 입력 가능 (기본값 3개월)
input int MonthsToExtract = 3;

void OnStart() {
   Print("🚀 Treia H1 Monthly Base Exporter 스크립트 시작... (추출 기간: " + IntegerToString(MonthsToExtract) + "개월)");
   
   // 추출할 시작 시간 계산 (현재 시간에서 MonthsToExtract 개월을 뺌)
   datetime end_time = TimeCurrent();
   datetime start_time = end_time - (MonthsToExtract * 30 * 24 * 60 * 60); // 대략적인 (30일 * N개월) 전
   
   // 파일 이름에 오늘 날짜 생성 (treia_h1_base_20260304.csv 포맷)
   string today_date = StringSubstr(TimeToString(end_time, TIME_DATE), 0, 4) + 
                       StringSubstr(TimeToString(end_time, TIME_DATE), 5, 2) + 
                       StringSubstr(TimeToString(end_time, TIME_DATE), 8, 2);
                       
   string filename = "treia_h1_base_" + today_date + ".csv";
   
   // 복사 폴더(Terminal/Common/Files)에 파일 열기
   int file_handle = FileOpen(filename, FILE_WRITE|FILE_CSV|FILE_ANSI|FILE_SHARE_READ|FILE_COMMON, ',');
   
   if(file_handle != INVALID_HANDLE) {
      // 헤더 작성 (시가, 고가, 저가, 종가, 거래량)
      FileWrite(file_handle, "Time", "Open", "High", "Low", "Close", "TickVolume");
      
      // CopyRates 함수를 사용해 시작 시간부터 끝 시간까지 H1 데이터의 바(Bar) 전체 객체 배열 가져오기
      MqlRates rates[];
      ArraySetAsSeries(rates, false); // 시간순 배열을 과거부터 현재 순(오름차순)으로 보정
      
      int copied = CopyRates(_Symbol, PERIOD_H1, start_time, end_time, rates);
      
      if(copied > 0) {
         Print("✅ 정상적으로 H1 캔들 " + IntegerToString(copied) + "개의 데이터를 가져왔습니다.");
         // 배열을 순회하며 CSV에 쓰기
         for(int i = 0; i < copied; i++) {
            FileWrite(file_handle,
               TimeToString(rates[i].time, TIME_DATE|TIME_MINUTES),
               DoubleToString(rates[i].open, _Digits),
               DoubleToString(rates[i].high, _Digits),
               DoubleToString(rates[i].low, _Digits),
               DoubleToString(rates[i].close, _Digits),
               (long)rates[i].tick_volume
            );
         }
         Print("🎉 " + filename + " 파일 저장 완료!");
      } else {
         Print("⚠️ H1 데이터를 가져오는데 실패했습니다: 오류 코드 = " + IntegerToString(GetLastError()));
      }
      FileClose(file_handle);
   } else {
      Print("❌ 파일을 여는 데 실패했습니다.");
   }
}
