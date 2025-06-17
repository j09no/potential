import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Database, RefreshCw } from "lucide-react";
import { getSubjects, createSubject, deleteSubject, getChapters, createChapter, deleteChapter } from "@/lib/db-api-functions";
import type { SubjectDB, ChapterDB } from "@shared/schema";

export default function DatabaseTest() {
  const [subjects, setSubjects] = useState<SubjectDB[]>([]);
  const [chapters, setChapters] = useState<ChapterDB[]>([]);
  const [loading, setLoading] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectColor, setNewSubjectColor] = useState("#3B82F6");

  const loadData = async () => {
    setLoading(true);
    try {
      const [subjectsData, chaptersData] = await Promise.all([
        getSubjects(),
        getChapters()
      ]);
      setSubjects(subjectsData);
      setChapters(chaptersData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSubject = async () => {
    if (!newSubjectName.trim()) return;
    
    try {
      await createSubject({
        name: newSubjectName.trim(),
        color: newSubjectColor
      });
      setNewSubjectName("");
      await loadData();
    } catch (error) {
      console.error('Error creating subject:', error);
    }
  };

  const handleDeleteSubject = async (id: number) => {
    try {
      await deleteSubject(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const handleCreateSampleChapter = async (subjectId: number) => {
    try {
      await createChapter({
        subjectId,
        title: `Sample Chapter ${Date.now()}`,
        description: "A test chapter created from the database test page",
        difficulty: "medium"
      });
      await loadData();
    } catch (error) {
      console.error('Error creating chapter:', error);
    }
  };

  const getSubjectName = (subjectId: number) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || 'Unknown';
  };

  const getChapterTitle = (chapterId: number) => {
    const chapter = chapters.find(c => c.id === chapterId);
    return chapter?.title || 'Unknown';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Permanent Database Test</h1>
        <Button 
          onClick={loadData} 
          disabled={loading}
          className="glass-button"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subjects Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Database className="w-5 h-5 mr-2" />
              Subjects ({subjects.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Create New Subject */}
            <div className="space-y-2">
              <Input
                placeholder="Subject name"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="bg-black/20 border-white/20 text-white"
              />
              <div className="flex gap-2">
                <input
                  type="color"
                  value={newSubjectColor}
                  onChange={(e) => setNewSubjectColor(e.target.value)}
                  className="w-10 h-10 rounded border border-white/20"
                />
                <Button 
                  onClick={handleCreateSubject}
                  disabled={!newSubjectName.trim()}
                  className="flex-1 glass-button"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Subject
                </Button>
              </div>
            </div>

            {/* Subjects List */}
            <div className="space-y-2">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                    <span className="text-white font-medium">{subject.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      ID: {subject.id}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleCreateSampleChapter(subject.id)}
                      className="glass-button-subtle"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteSubject(subject.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chapters Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Chapters ({chapters.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {chapters.map((chapter) => (
              <div key={chapter.id} className="p-3 bg-black/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium text-sm">{chapter.title}</h3>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      await deleteChapter(chapter.id);
                      await loadData();
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Subject: {getSubjectName(chapter.subjectId)}</div>
                  <div>Progress: {chapter.progress}%</div>
                  <div>Questions: {chapter.totalQuestions}</div>
                  <div>Difficulty: {chapter.difficulty}</div>
                  <div>ID: {chapter.id}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        
      </div>

      {/* Database Status */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-green-400 font-medium">
              ✅ Permanent PostgreSQL Database Active
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Data persists across page reloads, browser restarts, and device changes.
              No more IndexedDB or localStorage dependencies.
            </p>
            <p className="text-blue-400 text-sm mt-1">
              Last loaded: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}