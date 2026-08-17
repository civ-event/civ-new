import request from './request';

/** 获取活动基础信息（时间、状态） */
export function fetchActivityInfo() {
  return request.get('/activity/info');
}
