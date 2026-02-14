// src/lib/utils.ts (或放在合適的工具資料夾)
export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "--";
  const date = new Date(dateString);
  // 檢查是否為有效的日期物件
  if (isNaN(date.getTime())) return "--";
  
  return date.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};