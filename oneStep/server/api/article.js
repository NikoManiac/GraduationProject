/**
 * 文章相关操作
 */

let mongo = require('mongoose');

mongo.connect('mongodb://nikolan:123456@123.207.150.130:27017/oneStepDB');

let Schema = mongo.Schema;

// 错误信息
const msgStatusText = {
    error: '评论失败，请稍后再次尝试',
    success: '评论成功'
};

// 定义Schema
let articleSchema = new Schema({
    articleId: Number,
    articleContent: String,
    userId: Number,
    userName: String,
    commentArray: [
        {
            userId: Number,
            parentNodeId: Number,
            parentNodeName: String,
            content: String,
            commentCount: Number,
            zanCount: Number,
            commentTme: Date
        }
    ],
    creatTime: Date,
    similarArticle: [
        {
            articleId: Number
        }
    ]
}, {
    collection: 'article'
});

let Article = mongo.model('article', articleSchema);

articleSchema.statics.queryArticle = async function(aid) {
    let data = {};
    let res = await this.find({
        userId: aid
    });
    return res;
};

// 关闭连接
// mongoose.disconnect();

/**
 * 查询当前文章的所有评论
 */
// function queryAllComment(aid) {

// }
// addComment({userId: 4444});

let article = {
    addArticle: async (info) => {
        // 文章发布操作
        let result = {};
        let newArticle = new Article({
            userId: info.userId,
            userName: info.userName,
            articleContent: info.articleContent
        });
        try {
            let res = await newArticle.save();
            console.log(res);
            result.message = '文章发布成功';
            result.status = true;
            result.data = res;
        }
        catch (e) {
            result.message = '文章发布失败';
        }
        console.log(result);
        return result;
    },
    selectArticle: async (articleId) => {
        let result = {};
        // 查询文章
        try {
            let res = await Article.find({
                _id: articleId
            });
            // let res = await Article.queryArticle(articleId);
            console.log(res);
            result.message = '获取文章成功';
            result.status = true;
            result.data = res;
        }
        catch (e) {
            console.log(e);
            result.message = '获取文章失败';

        }
        return result;
    },
    selectComment: (body) => {
        // 读取评论

    },
    selectZan: (body) => {
        // 读取点赞数量

    },
    addComment: async (articleId, commentInfo) => {
        let result = {};
        // 参考文章
        // https://codeday.me/bug/20180204/128355.html
        // https://cnodejs.org/topic/548e54d157fd3ae46b233502
        // 添加评论
        try {
            let doc = await Article.findOneAndUpdate(articleId);
            result.status = true;
            result.doc = doc;
            result.message = '评论成功';
        }
        catch (e) {
            console.log(e);
            result.message = '评论失败';
        }

        return result;
    },
    addZan: () => {
        // 增加点赞
    }

};

module.exports = article;
