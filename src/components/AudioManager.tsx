import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Music, 
  Mic, 
  Download,
  FolderOpen,
  Settings,
  Headphones
} from 'lucide-react';

interface AudioFile {
  id: string;
  name: string;
  type: 'music' | 'sfx' | 'voice';
  url: string;
  duration: number;
  size: number;
  uploadedAt: Date;
}

interface AudioManagerProps {
  onBack: () => void;
}

export const AudioManager: React.FC<AudioManagerProps> = ({ onBack }) => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [activeCategory, setActiveCategory] = useState<'all' | 'music' | 'sfx' | 'voice'>('all');
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const categories = [
    { id: 'all', label: 'All Audio', icon: Headphones, count: audioFiles.length },
    { id: 'music', label: 'Music', icon: Music, count: audioFiles.filter(f => f.type === 'music').length },
    { id: 'sfx', label: 'Sound Effects', icon: Volume2, count: audioFiles.filter(f => f.type === 'sfx').length },
    { id: 'voice', label: 'Voice', icon: Mic, count: audioFiles.filter(f => f.type === 'voice').length }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    for (const file of files) {
      if (!file.type.startsWith('audio/')) {
        alert(`${file.name} is not an audio file`);
        continue;
      }

      // Create audio element to get duration
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      
      try {
        await new Promise((resolve, reject) => {
          audio.onloadedmetadata = resolve;
          audio.onerror = reject;
          audio.src = url;
        });

        // Determine type based on filename or let user categorize
        let type: 'music' | 'sfx' | 'voice' = 'sfx';
        const fileName = file.name.toLowerCase();
        if (fileName.includes('music') || fileName.includes('song') || fileName.includes('bgm')) {
          type = 'music';
        } else if (fileName.includes('voice') || fileName.includes('speech') || fileName.includes('talk')) {
          type = 'voice';
        }

        const newAudioFile: AudioFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type,
          url,
          duration: audio.duration,
          size: file.size,
          uploadedAt: new Date()
        };

        setAudioFiles(prev => [...prev, newAudioFile]);
      } catch (error) {
        alert(`Error loading ${file.name}`);
        URL.revokeObjectURL(url);
      }
    }

    setIsUploading(false);
    if (event.target) {
      event.target.value = '';
    }
  };

  const playAudio = (audioFile: AudioFile) => {
    if (currentlyPlaying === audioFile.id) {
      // Pause current audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentlyPlaying(null);
    } else {
      // Play new audio
      if (audioRef.current) {
        audioRef.current.src = audioFile.url;
        audioRef.current.volume = volume;
        audioRef.current.play();
      }
      setCurrentlyPlaying(audioFile.id);
    }
  };

  const deleteAudio = (audioFile: AudioFile) => {
    if (confirm(`Delete ${audioFile.name}?`)) {
      URL.revokeObjectURL(audioFile.url);
      setAudioFiles(prev => prev.filter(f => f.id !== audioFile.id));
      if (currentlyPlaying === audioFile.id) {
        setCurrentlyPlaying(null);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredAudioFiles = activeCategory === 'all' 
    ? audioFiles 
    : audioFiles.filter(f => f.type === activeCategory);

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'music': return 'from-purple-500 to-pink-600';
      case 'sfx': return 'from-green-500 to-teal-600';
      case 'voice': return 'from-blue-500 to-indigo-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'music': return <Music className="w-5 h-5" />;
      case 'sfx': return <Volume2 className="w-5 h-5" />;
      case 'voice': return <Mic className="w-5 h-5" />;
      default: return <Headphones className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={() => setCurrentlyPlaying(null)}
        onVolumeChange={(e) => setVolume((e.target as HTMLAudioElement).volume)}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold">🎵 Audio Manager</h1>
              <p className="text-purple-100">Manage your game's sound and music</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                <Upload className="w-5 h-5" />
                <span>{isUploading ? 'Uploading...' : 'Upload Audio'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 sticky top-8">
              <h2 className="text-xl font-bold text-white mb-6">Categories</h2>
              
              <div className="space-y-3">
                {categories.map(({ id, label, icon: Icon, count }) => (
                  <button
                    key={id}
                    onClick={() => setActiveCategory(id as unknown as 'all' | 'music' | 'sfx' | 'voice')}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200
                      ${activeCategory === id 
                        ? 'bg-purple-500 bg-opacity-30 border-2 border-purple-400' 
                        : 'bg-white bg-opacity-5 hover:bg-opacity-10 border-2 border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-white" />
                      <span className="text-white font-medium">{label}</span>
                    </div>
                    <span className="text-gray-300 text-sm">{count}</span>
                  </button>
                ))}
              </div>

              {/* Volume Control */}
              <div className="mt-8">
                <h3 className="text-white font-medium mb-3 flex items-center space-x-2">
                  <Volume2 className="w-4 h-4" />
                  <span>Master Volume</span>
                </h3>
                <div className="flex items-center space-x-3">
                  <VolumeX className="w-4 h-4 text-gray-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => {
                      const newVolume = parseFloat(e.target.value);
                      setVolume(newVolume);
                      if (audioRef.current) {
                        audioRef.current.volume = newVolume;
                      }
                    }}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <Volume2 className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-center text-gray-300 text-sm mt-1">
                  {Math.round(volume * 100)}%
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-8 space-y-3">
                <h3 className="text-white font-medium">Quick Stats</h3>
                <div className="bg-white bg-opacity-5 rounded-lg p-3">
                  <div className="text-gray-300 text-sm">Total Files</div>
                  <div className="text-white font-bold text-lg">{audioFiles.length}</div>
                </div>
                <div className="bg-white bg-opacity-5 rounded-lg p-3">
                  <div className="text-gray-300 text-sm">Total Size</div>
                  <div className="text-white font-bold text-lg">
                    {formatFileSize(audioFiles.reduce((sum, file) => sum + file.size, 0))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white bg-opacity-10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {activeCategory === 'all' ? 'All Audio Files' : 
                   activeCategory === 'music' ? 'Music Files' :
                   activeCategory === 'sfx' ? 'Sound Effects' : 'Voice Files'}
                </h2>
                <div className="text-gray-300">
                  {filteredAudioFiles.length} files
                </div>
              </div>

              {filteredAudioFiles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎵</div>
                  <h3 className="text-xl font-bold text-white mb-2">No Audio Files</h3>
                  <p className="text-gray-300 mb-6">
                    {activeCategory === 'all' 
                      ? 'Upload your first audio files to get started'
                      : `No ${activeCategory} files found. Upload some audio files and categorize them.`
                    }
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Upload Audio Files
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAudioFiles.map((audioFile) => (
                    <div
                      key={audioFile.id}
                      className="bg-white bg-opacity-5 rounded-xl p-4 hover:bg-opacity-10 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Type Icon */}
                        <div className={`p-3 bg-gradient-to-r ${getCategoryColor(audioFile.type)} rounded-lg`}>
                          {getCategoryIcon(audioFile.type)}
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate">{audioFile.name}</h3>
                          <div className="text-gray-300 text-sm space-y-1">
                            <div>Duration: {formatDuration(audioFile.duration)}</div>
                            <div>Size: {formatFileSize(audioFile.size)}</div>
                            <div className="capitalize">{audioFile.type}</div>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => playAudio(audioFile)}
                            className={`
                              p-2 rounded-lg transition-colors
                              ${currentlyPlaying === audioFile.id 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-green-600 hover:bg-green-700'
                              }
                            `}
                          >
                            {currentlyPlaying === audioFile.id ? (
                              <Pause className="w-4 h-4 text-white" />
                            ) : (
                              <Play className="w-4 h-4 text-white" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => deleteAudio(audioFile)}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>

                      {/* Currently Playing Indicator */}
                      {currentlyPlaying === audioFile.id && (
                        <div className="mt-3 flex items-center space-x-2 text-green-400">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-sm">Now Playing</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Instructions */}
            <div className="mt-6 bg-blue-500 bg-opacity-10 border border-blue-400 border-opacity-30 rounded-xl p-4">
              <h3 className="text-blue-300 font-medium mb-2">💡 Audio Tips</h3>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Supported formats: MP3, WAV, OGG, M4A</li>
                <li>• Files are automatically categorized by filename keywords</li>
                <li>• Use descriptive names like "background_music.mp3" or "jump_sfx.wav"</li>
                <li>• Keep file sizes reasonable for web performance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};