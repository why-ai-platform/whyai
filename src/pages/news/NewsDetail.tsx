import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  MessageSquare,
  Share2,
  Bookmark,
  TrendingUp
} from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { newsData } from './newsData';
import { ROUTES } from '../../constants';

export function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const newsItem = newsData.find(item => item.id === Number(id));

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Article Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate(ROUTES.NEWS)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Button>
        </Card>
      </div>
    );
  }

  // Related news articles (exclude current article)
  const relatedNews = newsData
    .filter(item => item.category === newsItem.category && item.id !== newsItem.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back Button */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(ROUTES.NEWS)}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Button>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="outline" className="text-sm">
              {newsItem.category}
            </Badge>
            {newsItem.trending && (
              <Badge className="bg-red-500 hover:bg-red-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                Trending
              </Badge>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {newsItem.title}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {newsItem.description}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>{newsItem.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{newsItem.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{newsItem.readTime}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              <span>{newsItem.comments} Comments</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-8">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="rounded-lg overflow-hidden shadow-lg">
            <ImageWithFallback
              src={newsItem.image}
              alt={newsItem.title}
              className="w-full h-[400px] object-cover"
            />
          </div>
        </motion.div>

        {/* Article Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="prose prose-lg dark:prose-invert max-w-none mb-12"
        >
          <div
            className="text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: newsItem.content }}
          />
        </motion.div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-12" />

        {/* Related Articles */}
        {relatedNews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((item) => (
                <Card
                  key={item.id}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => {
                    navigate(ROUTES.NEWS_DETAIL.replace(':id', item.id.toString()));
                    window.scrollTo(0, 0);
                  }}
                >
                  <div className="relative overflow-hidden h-40">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2 text-xs">
                      {item.category}
                    </Badge>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      {item.date}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Comments Section Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <Card className="p-8 text-center bg-gray-50 dark:bg-gray-800">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Comments ({newsItem.comments})
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Comments section coming soon. Join the discussion!
            </p>
          </Card>
        </motion.div>
      </article>
    </div>
  );
}
