
const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('../pages/Index.vue') },
      { path: '/enroll', component: () => import('../pages/EnHospitalizedEnroll') },
      { path: '/enroll_search', component: () => import('../pages/EnHospitalizedSearch.vue') },
      { path: '/out', component: () => import('../pages/OutHospitalizedEnroll.vue') },
      { path: '/out_search', component: () => import('../pages/OutHospitalizedSearch.vue') },
      { path: '/test5', component: () => import('../pages/TransferHospitalOrWard.vue') },
      { path: '/ward_add', component: () => import('../pages/WardAdd.vue') },
      { path: '/ward_adjust', component: () => import('../pages/ReviseWard.vue') },
      { path: '/pay_pre', component: () => import('../pages/Pay.vue') },
      { path: '/pay_record', component: () => import('../pages/PayRecord.vue') },
      { path: '/pay_search', component: () => import('../pages/PaySearch.vue') },
      { path: '/statistic_patient', component: () => import('../pages/PatientStatistic.vue') },
      { path: '/statistic_ward', component: () => import('../pages/WardStatistic.vue') },
      { path: '/med_enroll', component: () => import('../pages/MedicationEnroll.vue') },
      { path: '/med_dis', component: () => import('../pages/MedicationDistribute.vue') },
      { path: '/med_rtn', component: () => import('../pages/MedicationReturn.vue') },
      { path: '/med_stock', component: () => import('../pages/MedicationEnrollSearch.vue') },
      { path: '/med_reserve_stock', component: () => import('../pages/MedicationStock.vue') },
      { path: '/user_regist', component: () => import('../pages/UserRegister.vue') },
      { path: '/user_search', component: () => import('../pages/UserSearch.vue') },
      { path: '/doc_enroll', component: () => import('../pages/DoctorEnroll.vue') },
      { path: '/doc_search', component: () => import('../pages/DoctorSearch.vue') },
      { path: '/log', component: () => import('../pages/Systemlog.vue') },
      { path: '/mypatient', component: () => import('../pages/MyPatient.vue') },
      { path: '/record_patient', component: () => import('../pages/RecordPatient.vue') },
      { path: '/nurse_patient', component: () => import('../pages/NursePatients.vue') },
      { path: '/nurse_repatient', component: () => import('../pages/RecordNursePatients.vue') },
      { path: '/medical_advice', component: () => import('../pages/MedicalAdvice.vue') }
    ]
  },
  { path: '/login', component: () => import('../pages/Login.vue') },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('../pages/Error404.vue')
  }
]

export default routes
