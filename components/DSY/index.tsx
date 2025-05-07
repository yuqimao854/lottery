import React, { useState } from 'react';

export const DSY = () => {
  const imageUrls = [
    '/images/dsy/1.jpg',
    '/images/dsy/2.jpg',
    '/images/dsy/3.jpg',
    '/images/dsy/4.jpg',
    '/images/dsy/5.jpg',
    '/images/dsy/6.jpg',
    '/images/dsy/7.jpg',
    '/images/dsy/8.jpg',
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false); // 用来控制关闭动画
  const [currentIndex, setCurrentIndex] = useState<number>(0); // 当前图片的索引

  const openModal = (imageUrl: string, index: number) => {
    setSelectedImage(imageUrl);
    setCurrentIndex(index); // 更新当前图片的索引
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsClosing(true); // 触发关闭动画
    setTimeout(() => {
      setIsModalOpen(false); // 动画完成后关闭
      setSelectedImage(null);
      setIsClosing(false); // 重置关闭动画状态
    }, 300); // 动画时长
  };

  const showNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    setSelectedImage(imageUrls[(currentIndex + 1) % imageUrls.length]);
  };

  const showPreviousImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
    setSelectedImage(
      imageUrls[currentIndex === 0 ? imageUrls.length - 1 : currentIndex - 1]
    );
  };

  return (
    <div className='relative bg-gradient-to-br from-slate-100 via-sky-200 to-teal-100 min-h-screen p-6'>
      <h2 className='text-4xl font-extrabold text-center mb-10 drop-shadow-md bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent'>
        山海之间 · 镜头拾光
      </h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center max-w-screen-xl mx-auto'>
        {imageUrls.map((url, index) => (
          <div
            key={index}
            className='relative w-full max-w-xs aspect-[1/1] rounded-3xl shadow-2xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105'
            onClick={() => openModal(url, index)}
          >
            <img
              src={url}
              alt={`photo-${index}`}
              className='w-full h-full object-cover rounded-3xl'
            />
            <div className='absolute bottom-4 left-4 text-white font-semibold text-lg bg-opacity-50 bg-black p-2 px-4 rounded-2xl shadow-lg transform translate-y-2'>
              镜头下的故事 {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* 弹窗效果 */}
      {isModalOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300 ${
            isClosing ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={closeModal}
        >
          <div
            className='relative bg-white rounded-2xl overflow-hidden p-4 max-w-[90vw] max-h-[90vh] transition-transform duration-300 transform'
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage || ''}
              alt='Selected'
              className='max-w-full max-h-[80vh] object-contain'
            />

            {/* 关闭按钮 */}
            <button
              onClick={closeModal}
              className='absolute top-4 right-4 text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-500 rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-lg transition-all duration-300 transform hover:scale-110'
            >
              &times;
            </button>

            {/* 左右切换按钮 */}
            <button
              onClick={showPreviousImage}
              className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-500 rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg transition-all duration-300 transform hover:scale-110'
            >
              &lt;
            </button>
            <button
              onClick={showNextImage}
              className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-500 rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg transition-all duration-300 transform hover:scale-110'
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
