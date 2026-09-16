import { MemoryMediaItem } from './types';

/**
 * Compresses an image File to a base64 Data URL to fit safely in client storage
 */
export async function fileToDataUrl(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.82): Promise<string> {
  if (file.type.startsWith('image/')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          // Try to export as image/jpeg for compactness, fallback to webp/png
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  } else if (file.type.startsWith('video/')) {
    // For videos:
    // If under 4MB, convert to data URL so it persists. Otherwise use ObjectURL with in-session playback.
    if (file.size <= 4 * 1024 * 1024) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } else {
      return URL.createObjectURL(file);
    }
  }

  throw new Error('Unsupported file format');
}

/**
 * Generates an empathetic, personalized companion note from Hana
 * based on memory title, text, emotion, photos, videos, and optional note.
 */
export function generateHanaMemoryResponse(
  userName: string,
  title: string,
  text: string,
  emotion: string,
  mediaCount: { photos: number; videos: number },
  note?: string
): string {
  const name = userName ? userName : 'my dear friend';
  const hasPhotos = mediaCount.photos > 0;
  const hasVideos = mediaCount.videos > 0;

  let mediaRemark = '';
  if (hasPhotos && hasVideos) {
    mediaRemark = `I looked at the photos and watched the video you saved here—it brings your memory to life in such a vivid, magical way. ✨`;
  } else if (hasPhotos) {
    mediaRemark = `The ${mediaCount.photos === 1 ? 'photo you' : `${mediaCount.photos} photos you`} attached capture this moment so warmly. Looking at it makes me feel like I am standing right beside you. 📷🌸`;
  } else if (hasVideos) {
    mediaRemark = `The video you kept here preserves the sound and motion of this moment so beautifully. 🎥✨`;
  }

  let noteRemark = '';
  if (note && note.trim()) {
    noteRemark = ` Your personal note ("${note.slice(0, 70)}${note.length > 70 ? '...' : ''}") shows how much reflection and heart you poured into this.`;
  }

  switch (emotion) {
    case 'happy':
      return `Oh ${name}! 🌸 Reading about "${title || 'this joyful moment'}" makes my fairy wings flutter with pure delight! Your happiness shines through every word: "${text.slice(0, 60)}...". ${mediaRemark}${noteRemark} Thank you for trusting me with such a radiant memory. This tree will keep shining in Hanamori for a very long time! 💖`;

    case 'love':
      return `Such deep warmth, ${name}... 💗 The affection in "${title || 'this memory'}" is so pure and tender. Keeping this feeling safe in your garden keeps that love alive forever. ${mediaRemark}${noteRemark} You have a truly kind, loving spirit. I'll watch over this heart blossom with you! 🌷`;

    case 'peaceful':
      return `Breathe gently with me, ${name}. 🌱 Reading this brings such a serene calmness to our garden. Moments of stillness like "${title || 'peace'}" are quiet anchors for our hearts. ${mediaRemark}${noteRemark} Whenever life feels hurried, you can come sit by this tree and reclaim this peace. 🍃`;

    case 'hope':
      return `What a bright dawn this brings, ${name}! ☀️ "${title || 'This spark'}" carries so much quiet courage. Hope is the sunlight that nourishes every seed in Hanamori. ${mediaRemark}${noteRemark} I believe in where your journey is leading. Keep this golden light close to your chest! ✨`;

    case 'sad':
      return `I am right here with you, ${name}. 🌧️ It takes courage to be honest about sadness. When you wrote "${title || 'this memory'}", you gave your tears a gentle place to rest in the soil instead of holding them alone. ${mediaRemark}${noteRemark} There is no rush to feel better. I will sit quietly with you under this weeping branch whenever you need comfort. 💙`;

    case 'lonely':
      return `You are never alone in Hanamori, ${name}. 🌙 Even in quiet twilight hours, I am here listening to your heartbeat and your thoughts. "${title || 'This feeling'}" is valid, and keeping it here means you never have to carry it all by yourself. ${mediaRemark}${noteRemark} Look up at the stars above your garden—each one shines for you. 💜`;

    case 'angry':
      return `I hear you loud and clear, ${name}. 🔥 Frustration and anger are real, human feelings that need an honest release. Pouring it into "${title || 'this memory'}" helps let the heat disperse safely into the ground. ${mediaRemark}${noteRemark} Take a deep breath with me. Your feelings are respected and safe here with me. ❤️`;

    default:
      return `Thank you for sharing "${title}" with me, ${name}. 🌸 Every memory you bring into Hanamori makes our garden richer and your story more complete. ${mediaRemark}${noteRemark} I will cherish this with you always! 🌿`;
  }
}
