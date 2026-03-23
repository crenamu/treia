export interface DepositOption {
	dcls_month: string;
	fin_co_no: string;
	fin_prdt_cd: string;
	intr_rate_type: string;
	intr_rate_type_nm: string;
	save_trm: string;
	intr_rate: number;
	intr_rate2: number;
	rsrv_type_nm?: string;
}

export interface DepositProduct {
	dcls_month: string;
	fin_co_no: string;
	fin_prdt_cd: string;
	kor_co_nm: string;
	fin_prdt_nm: string;
	join_way: string;
	mtrt_int: string;
	spcl_cnd: string;
	join_deny: string;
	join_member: string;
	etc_note: string;
	max_limit: number | null;
	dcls_strt_day: string;
	dcls_end_day: string | null;
	options: DepositOption[];
	bestOption: DepositOption;
}
