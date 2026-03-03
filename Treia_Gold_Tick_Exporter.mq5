// Treia_Gold_Tick_Exporter.mq5
#property copyright "Treia AI Master"
#property version   "1.10"
#property strict

string filename = "treia_gold_ticks.csv";
int file_handle;

int OnInit() {
   Print("🚀 Treia Gold Tick Exporter 시작됨...");
   // 보수적으로 다시 한번 파일 생성 및 헤더 확인
   file_handle = FileOpen(filename, FILE_WRITE|FILE_CSV|FILE_ANSI|FILE_SHARE_READ|FILE_COMMON, ',');
   if(file_handle != INVALID_HANDLE) {
      FileWrite(file_handle, "Timestamp", "Bid", "Ask", "Last", "Volume");
      FileClose(file_handle);
   }
   return(INIT_SUCCEEDED);
}

void OnTick() {
   MqlTick last_tick;
   if(SymbolInfoTick(_Symbol, last_tick)) {
      // 파일 끝에 추가하기 위해 오픈
      file_handle = FileOpen(filename, FILE_READ|FILE_WRITE|FILE_CSV|FILE_ANSI|FILE_SHARE_READ|FILE_COMMON, ',');
      if(file_handle != INVALID_HANDLE) {
         FileSeek(file_handle, 0, SEEK_END);
         FileWrite(file_handle, 
            TimeToString(last_tick.time, TIME_DATE|TIME_SECONDS), 
            DoubleToString(last_tick.bid, _Digits), 
            DoubleToString(last_tick.ask, _Digits),
            DoubleToString(last_tick.last, _Digits),
            (long)last_tick.volume  // 'tick_volume'을 'volume'으로 수정 완료
         );
         FileClose(file_handle);
      }
   }
}

void OnDeinit(const int reason) {
   Print("🛑 Treia Exporter 중단됨.");
}
