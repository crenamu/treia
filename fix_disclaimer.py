import sys
import os

def replace_lines(file_path, start_line, end_line, new_content):
    if not os.path.exists(file_path):
        print(f"Error: File {file_path} not found")
        return False
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # 1-indexed to 0-indexed
    start_idx = start_line - 1
    end_idx = end_line # end_line is inclusive in replace_file_content, but our slicing is [start:end]
    
    new_lines = lines[:start_idx] + [new_content + '\n'] + lines[end_idx:]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    return True

if __name__ == "__main__":
    target_file = r"c:\work\AI 리더캠프\projects\treia\app\treia\page.tsx"
    
    new_content = """                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[13px] text-[#7a7f8e] font-light leading-[1.8] break-keep">
                  <div className="flex flex-col gap-2">
                    <strong className="text-white font-medium block">1. 살아있는 시장을 위한 지속적인 알고리즘 진화</strong>
                    <p>Treia 엔진은 고정된 기계가 아닙니다. 시장의 새로운 변동성 패턴에 대응하고 방어력을 극대화하기 위해 로직은 상시 보완됩니다. 이 과정에서 알고리즘의 매매 템포나 진입 기준은 사전 예고 없이 유연하게 조정될 수 있습니다.</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <strong className="text-white font-medium block">2. 브로커 및 물리적 환경에 따른 체결 오차 (슬리피지)</strong>
                    <p>실제 체결 결과는 사용자가 이용하는 브로커의 서버 상태, 네트워크 지연 속도(Ping), 유동성에 따라 달라질 수 있습니다. 이로 인해 마스터 계좌와 완벽히 동일한 가격에 체결되지 않는 &apos;슬리피지&apos; 현상이 발생할 수 있으며, 이는 자동매매의 물리적 특성입니다.</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <strong className="text-white font-medium block">3. 통제 불가능한 거시적 충격 (블랙스완) 대응 한계</strong>
                    <p>전쟁, 자연재해, 혹은 시장에 극단적인 충격을 주는 예측 불가능한 뉴스 발생 시에는 주문 임계치를 넘어서는 등 물리적으로 알고리즘의 통제가 불가능한 영역이 발생할 수 있습니다.</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <strong className="text-white font-medium block">4. 최종 운용 결정권과 자산의 귀속</strong>
                    <p>본 소프트웨어는 투자의 확률적 우위를 위한 보조 도구일 뿐, 무손실을 보장하지 않습니다. 소프트웨어 가동 여부 결정권은 전적으로 사용자 본인에게 있으며, 모든 금융 거래의 최종적인 결과와 책임은 사용자에게 귀속됩니다.</p>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-[#1a1a1a]/50 flex flex-col gap-3 text-[12px] text-[#555]">
                  <p>• 본 테스트 결과는 데모 운용 데이터이며 미래의 수익을 보장하지 않습니다.</p>
                  <p>• 차액결제거래(CFD)는 높은 변동성을 수반하며 원금 초과 손실의 위험이 있습니다.</p>
                  <p>• 본 서비스는 투자 권유가 아니며, 고객 본인의 판단에 의한 라이선스 체험 및 렌탈에 한합니다. 투자의 모든 최종 결정과 법적 책임은 사용자 본인에게 있습니다.</p>
                </div>"""
    
    if replace_lines(target_file, 598, 602, new_content):
        print("Success")
    else:
        print("Failed")
