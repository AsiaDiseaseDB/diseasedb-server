# api-doc

> last modified: 2017-04-06  
> by mingyu

## /manage

### /manage/searchUser (POST)

Search the user you want.

```javascript
req: {
  username
}
res: {
  success: 'bool',
  result: 'array',
  err: 'object'
}
```

### /manage/searchAllUser (POST)

Get all users in the database.

```javascript
req: {
  // an empty object will be fine
}
res: {
  success: 'bool',
  result: 'array',
  err: 'object'
}
```

### /manage/addUser (POST)

Add a new user with specific name, password and authority.

```javascript
req: {
  username: 'string',
  password: 'string',
  authority: 'number',
  managerInfo: 'object'
}
res: {
  success: 'bool',
  err: 'object'
}
```

### /manage/deleteUser (POST)

Delete a user with specific name.

```javascript
req: {
  username: 'string',
  managerInfo: 'object'
}
res: {
  success: 'bool',
  err: 'object'
}
```

### /manage/modifyPassword (POST)

Change the password of a user.

```javascript
req: {
  username: 'string',
  password: 'string',
  managerInfo: 'object'
}
res: {
  success: 'bool',
  err: 'object'
}
```

### /manage/modifyAuthority

Change the authority of a user.

```javascript
req: {
  username: 'string',
  authority: 'number',
  managerInfo: 'object'
}
res: {
  success: 'bool',
  err: 'object'
}
```

---
## /option

---
## /report

---
## /

### /loginReq (post)

Login request.

```javascript
req: {
  username: 'string',
  password: 'string'
}
res: {
  success: 'bool',
  id: 'number',
  authority: {
    write: 'bool',
    query: 'bool',
    modify: 'bool',
    extract: 'bool'
  },
  err: 'string'
}
```

### /register (post)

Register a visiter.

```javascript
req: {
  username: 'string',
  password: 'string',
  authority: 'number'
}
res: {
  success: 'bool',
  err: 'object'
}
```

### /query (post)

Use reportID or conditions to query reports.

```javascript
req: {
  id: 'number',  //  若id为null则不用考虑id
  condition: {
    disease: 'string',    //  如果未指定则设为null
    country: 'string',    //  如果未指定则设为null
    year: 'number',       //  如果未指定则设为null
    doubleClick: 'bool'   //  如果未指定则设为null
  },
  authority: 'number'
}
res: {
  result: 'array'
}
```

### /getidtree (post)

Get the tree of id whose root is the given id.

```javascript
req: {
  id: 'number'  //  ReportID
}
res: {
  data: 'object',  //  若发生错误设置成null
  err: 'object'    //  若未发生错误设置为null
}
```

### /getidcontent (post)

Get the content of a table with given id.

```javascript
req: {
  type: 'string',
  id: 'number'  //  ReportID
}
res: {
  data: 'object',
  err: 'object'
}
```

### /getid (post)

Get a new id.

```javascript
req: {
  type: 'string'
}
res {
  id: number
}
```

### /add (post)

Add a table.

```javascript
req: {
  type: 'string',
  data: 'object'
}
res: {
  success: 'bool',
  err: 'string'
}
```

### /delete (post)

```javascript
req: {
  type: 'string'
  id: 'number'
}
res: {
  success: 'bool',
  err: 'object'
}
```

### /edit (post)

```javascript
req: {
  type: 'string',
  id: 'number',
  data: 'object'
}
res: {
  success: 'bool',
  err: 'object'
}
```

### /exportexcel (get)

```javascript
req: {
  ids: 'array'
}
res: {
  success: 'bool',
  err: err
}
```

### /importexcel (post)

```javascript
req: {
  (file) xlsx/xls,
  id: 'number',
  username: 'string'
}
res {
  success: 'bool',
  err: 'object'
}
```

---
