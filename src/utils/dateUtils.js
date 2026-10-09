function getTodayLabel() {
  return 'Today';
}

function getTomorrowLabel() {
  return 'Tomorrow';
}

function getNextWeekLabel() {
  return 'Next week';
}

function getDueDateOptions() {
  return [
    'No date',
    getTodayLabel(),
    getTomorrowLabel(),
    getNextWeekLabel(),
  ];
}

export {
  getTodayLabel,
  getTomorrowLabel,
  getNextWeekLabel,
  getDueDateOptions,
};