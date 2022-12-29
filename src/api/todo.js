import service from '../utils/request';
// mysql所有的todolist
export const getData = () => {
    return new Promise((resolve, reject) => {
        service.request({
            method: 'GET',
            url: '/getTodos'
        }).then((res) => {
            resolve(res);
        }).catch(error => {
            reject(error);
        })
    })
};
export const addNewList = (data) => {
    service.request({
        method: 'POST',
        url: '/addTodo',
        data
    })
};
export const delListItem = (data) => {
    service.request({
        method: 'POST',
        url: '/delTodo',
        data
    })
};

export const batchDelList = (data) => {
    service.request({
        method: 'POST',
        url: '/batchDelTodo',
        data
    })
};
export const modifyListItem = (data) => {
    service.request({
        method: 'POST',
        url: '/modifyTodo',
        data
    })
}