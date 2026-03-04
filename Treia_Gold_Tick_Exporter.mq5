// Treia_Gold_Tick_Exporter.mq5
#property copyright "Treia AI Master"
#property version   "1.10"
#property strict

string GetDailyFilename() {
   return "treia_gold_ticks_" + TimeToString(TimeCurrent(), TIME_DATE | TIME_MINUTES | TIME_SECONDS) + ".csv";
}

string current_filename = "";
int file_handle;

int OnInit() {
   Print("🚀 Treia Gold Tick Exporter 시작됨 (일 단위 저장)...");
   return(INIT_SUCCEEDED);
}

void OnTick() {
   MqlTick last_tick;
   if(SymbolInfoTick(_Symbol, last_tick)) {
      // 오늘 날짜 추출 (예: 20260304)
      string today_date = StringSubstr(TimeToString(last_tick.time, TIME_DATE), 0, 4) + 
                          StringSubstr(TimeToString(last_tick.time, TIME_DATE), 5, 2) + 
                          StringSubstr(TimeToString(last_tick.time, TIME_DATE), 8, 2);
      
      string new_filename = "treia_gold_ticks_" + today_date + ".csv";
      
      // 파일이 변경되었거나(새로운 날짜) 처음 실행되는 경우 헤더 생성
      if (new_filename != current_filename) {
         current_filename = new_filename;
         file_handle = FileOpen(current_filename, FILE_WRITE|FILE_CSV|FILE_ANSI|FILE_SHARE_READ|FILE_COMMON, ',');
         if(file_handle != INVALID_HANDLE) {
            FileWrite(file_handle, "Timestamp", "Bid", "Ask", "Last", "Volume");
            FileClose(file_handle);
         }
      }

      // 파일 끝에 틱 데이터 추가
      file_handle = FileOpen(current_filename, FILE_READ|FILE_WRITE|FILE_CSV|FILE_ANSI|FILE_SHARE_READ|FILE_COMMON, ',');
      if(file_handle != INVALID_HANDLE) {
         FileSeek(file_handle, 0, SEEK_END);
         FileWrite(file_handle, 
            TimeToString(last_tick.time, TIME_DATE|TIME_SECONDS), 
            DoubleToString(last_tick.bid, _Digits), 
            DoubleToString(last_tick.ask, _Digits),
            DoubleToString(last_tick.last, _Digits),
            (long)last_tick.volume
         );
         FileClose(file_handle);
      }
   }
}

void OnDeinit(const int reason) {
   Print("🛑 Treia Exporter 중단됨.");
}
