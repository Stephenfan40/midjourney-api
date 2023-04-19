// 引入 express 库， fs 库，和 CORS 库
const express = require('express');
const fs = require('fs');
const cors = require('cors');

// 创建 express 应用程序以及监听端口
const app = express();
const port = 3001;

// 使用 JSON 解析中间件和 CORS 中间件
app.use(express.json());
app.use(cors());

// 处理 GET 请求，读取 midjourneyData.json 文件
app.get('/api/midjourneyData', (req, res) => {
  fs.readFile('midjourneyData.json', 'utf8', (err, data) => {
    if (err) {
      // 如果读取文件失败，返回 500 状态码和错误信息
      res.status(500).send('读取数据失败');
    } else {
      // 如果读取文件成功，将数据解析为 JSON 格式并返回
      res.send(JSON.parse(data));
    }
  });
});

// 处理 POST 请求，将数据写入 midjourneyData.json 文件
app.post('/api/midjourneyData', (req, res) => {
  // 获取请求体中的数据
  const newData = req.body;

  // 验证请求体中的数据
  if (
    !newData ||
    !newData.title ||
    !newData.description ||
    !newData.imageUrl ||
    !newData.tags ||
    !newData.content
  ) {
    res.status(400).send('请求数据无效');
    return;
  }

  // 读取 midjourneyData.json 文件
  fs.readFile('midjourneyData.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('读取数据失败');
    } else {
      const midjourneyData = JSON.parse(data);
      // 检查 midjourneyData 数组是否为空
      if (midjourneyData.length === 0) {
        newData.id = 1;
      } else {
        newData.id = midjourneyData[midjourneyData.length - 1].id + 1;
      }
      midjourneyData.push(newData);
      // 将更新后的数据写入文件中
      fs.writeFile('midjourneyData.json', JSON.stringify(midjourneyData), 'utf8', (err) => {
        if (err) {
          res.status(500).send('保存数据失败');
        } else {
          res.status(201).send('数据保存成功');
        }
      });
    }
  });
});

// 处理 PUT 请求，更新 midjourneyData.json 文件中的数据
app.put('/api/midjourneyData/:id', (req, res) => {
  const idToUpdate = parseInt(req.params.id);
  const updatedData = req.body;

  // 验证请求体中的数据
  if (
    !updatedData ||
    !updatedData.title ||
    !updatedData.description ||
    !updatedData.imageUrl ||
    !updatedData.tags ||
    !updatedData.content
  ) {
    res.status(400).send('请求数据无效');
    return;
  }

  fs.readFile('midjourneyData.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('读取数据失败');
    } else {
      const midjourneyData = JSON.parse(data);
      const dataIndex = midjourneyData.findIndex((item) => item.id === idToUpdate);

      if (dataIndex === -1) {
        res.status(404).send('未找到要更新的数据');
      } else {
        updatedData.id = idToUpdate;
        midjourneyData[dataIndex] = updatedData;
    
        fs.writeFile('midjourneyData.json', JSON.stringify(midjourneyData), 'utf8', (err) => {
          if (err) {
            res.status(500).send('更新数据失败');
          } else {
            res.status(200).send('数据更新成功');
          }
        });
      }
    }
  });
});

// 处理 DELETE 请求，删除 midjourneyData.json 文件中的数据
app.delete('/api/midjourneyData/:id', (req, res) => {
  const idToDelete = parseInt(req.params.id);
  
  fs.readFile('midjourneyData.json', 'utf8', (err, data) => {
  if (err) {
  res.status(500).send('读取数据失败');
  } else {
  const midjourneyData = JSON.parse(data);
  const dataIndex = midjourneyData.findIndex((item) => item.id === idToDelete);
  if (dataIndex === -1) {
  res.status(404).send('未找到要删除的数据');
  } else {
  midjourneyData.splice(dataIndex, 1);
  fs.writeFile('midjourneyData.json', JSON.stringify(midjourneyData), 'utf8', (err) => {
    if (err) {
      res.status(500).send('删除数据失败');
    } else {
      res.status(200).send('数据删除成功');
    }
  });
}
}
});
});


// 启动应用程序
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});