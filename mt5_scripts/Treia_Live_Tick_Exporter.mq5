//+------------------------------------------------------------------+
//|                                     Treia_Live_Tick_Exporter.mq5 |
//|                                      Copyright 2026, Crenamu Lab |
//+------------------------------------------------------------------+
#property copyright "Copyright 2026, Crenamu Lab"
#property link      "https://treia.vercel.app/"
#property version   "1.00"
#property description "실시간 틱(Tick) 데이터를 캡처하여 매일 단위로 CSV에 기록하는 백그라운드 EA입니다."

input string FileNamePrefix = "treia_gold_ticks_";

int file_handle = INVALID_HANDLE;
string current_filename = "";

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
  {
   Print("Treia 실시간 틱 수집기(Stop Hunt 분석용) 시작 - Symbol: ", Symbol());
   OpenNewDayFile();
   return(INIT_SUCCEEDED);
  }

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
  {
   if(file_handle != INVALID_HANDLE)
     {
      FileClose(file_handle);
      file_handle = INVALID_HANDLE;
     }
   Print("Treia 실시간 틱 수집기 종료");
  }

//+------------------------------------------------------------------+
//| Expert tick function                                             |
//+------------------------------------------------------------------+
void OnTick()
  {
   // 날짜가 바뀌면 새로운 파일 열기
   string today_str = TimeToString(TimeCurrent(), TIME_DATE);
   string expected_filename = FileNamePrefix + StringSubstr(today_str, 0, 4) + StringSubstr(today_str, 5, 2) + StringSubstr(today_str, 8, 2) + ".csv";
   
   if(expected_filename != current_filename)
     {
      OpenNewDayFile();
     }

   if(file_handle == INVALID_HANDLE) return;

   MqlTick last_tick;
   if(SymbolInfoTick(Symbol(), last_tick))
     {
      string time_str = TimeToString(last_tick.time, TIME_DATE|TIME_MINUTES|TIME_SECONDS);
      // 포맷: Timestamp,Bid,Ask,Last,Volume
      string line = StringFormat("%s,%.2f,%.2f,%.2f,%d", time_str, last_tick.bid, last_tick.ask, last_tick.last, last_tick.volume);
      
      FileWriteString(file_handle, line + "\n");
      FileFlush(file_handle); // 즉시 디스크에 쓰기 (클라우드 봇이 즉각 읽을 수 있도록)
     }
  }

//+------------------------------------------------------------------+
//| 새로운 날짜의 파일을 여는 함수                                     |
//+------------------------------------------------------------------+
void OpenNewDayFile()
  {
   if(file_handle != INVALID_HANDLE)
     {
      FileClose(file_handle);
     }
     
   string today_str = TimeToString(TimeCurrent(), TIME_DATE);
   current_filename = FileNamePrefix + StringSubstr(today_str, 0, 4) + StringSubstr(today_str, 5, 2) + StringSubstr(today_str, 8, 2) + ".csv";
   
   // 공용 폴더 (FILE_COMMON) 에 쓰기 모드(FILE_WRITE) 및 텍스트 모드(FILE_TXT), 
   // 기존 내용에 이어서 쓰기(FILE_READ 추가) 
   file_handle = FileOpen(current_filename, FILE_WRITE|FILE_READ|FILE_TXT|FILE_COMMON|FILE_SHARE_READ);
   
   if(file_handle != INVALID_HANDLE)
     {
      // 파일 크기가 0이면 헤더 작성
      if(FileSize(file_handle) == 0)
        {
         FileWriteString(file_handle, "Timestamp,Bid,Ask,Last,Volume\n");
         FileFlush(file_handle);
        }
      else
        {
         // 이미 파일이 존재하면 맨 끝으로 이동
         FileSeek(file_handle, 0, SEEK_END);
        }
      Print("틱 데이터 로깅 준비 완료: ", current_filename);
     }
   else
     {
      Print("파일 열기 실패: ", current_filename, ". 에러 코드: ", GetLastError());
     }
  }
