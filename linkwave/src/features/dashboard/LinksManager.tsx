'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, GripVertical, Pencil, Trash2, X, Check, ExternalLink, ToggleLeft, ToggleRight } from 'lucide-react'
import { toast } from 'sonner'
import { linkService } from '@/services'
import { linkSchema, type LinkInput } from '@/lib/validations'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Link as LinkType } from '@/types'

function SortableLink({
  link,
  onEdit,
  onDelete,
  onToggle,
}: {
  link: LinkType
  onEdit: (l: LinkType) => void
  onDelete: (id: string) => void
  onToggle: (id: string, active: boolean) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id })

  return (
    <motion.div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center gap-3 bg-white/70 dark:bg-slate-800/70 rounded-2xl p-4 border border-white/60 group"
      layout
    >
      <button {...attributes} {...listeners} className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing">
        <GripVertical size={18} />
      </button>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{link.title}</p>
        <p className="text-slate-400 text-xs truncate">{link.url}</p>
      </div>
      <span className="text-xs text-slate-400">{link.clicks} cliques</span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onToggle(link.id, !link.is_active)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
          {link.is_active ? <ToggleRight size={16} className="text-emerald-500" /> : <ToggleLeft size={16} className="text-slate-400" />}
        </button>
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
          <ExternalLink size={14} className="text-slate-400" />
        </a>
        <button onClick={() => onEdit(link)} className="p-1.5 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900">
          <Pencil size={14} className="text-sky-500" />
        </button>
        <button onClick={() => onDelete(link.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900">
          <Trash2 size={14} className="text-red-400" />
        </button>
      </div>
    </motion.div>
  )
}

export default function LinksManager({ profileId, initialLinks }: { profileId?: string; initialLinks: LinkType[] }) {
  const [links, setLinks] = useState(initialLinks)
  const [editingLink, setEditingLink] = useState<LinkType | null>(null)
  const [showForm, setShowForm] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor))
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<LinkInput>({ resolver: zodResolver(linkSchema) })

  async function onSubmit(values: LinkInput) {
    if (!profileId) return
    try {
      if (editingLink) {
        const updated = await linkService.update(editingLink.id, values)
        setLinks((prev) => prev.map((l) => (l.id === editingLink.id ? updated : l)))
        toast.success('Link atualizado!')
      } else {
        const newLink = await linkService.create({
          profile_id: profileId,
          title: values.title,
          url: values.url,
          icon: values.icon ?? null,
          order_index: links.length,
          is_active: true,
        })
        setLinks((prev) => [...prev, newLink])
        toast.success('Link adicionado!')
      }
      reset()
      setEditingLink(null)
      setShowForm(false)
    } catch {
      toast.error('Erro ao salvar link')
    }
  }

  function handleEdit(link: LinkType) {
    setEditingLink(link)
    setValue('title', link.title)
    setValue('url', link.url)
    setValue('icon', link.icon ?? '')
    setShowForm(true)
  }

  async function handleDelete(id: string) {
    try {
      await linkService.delete(id)
      setLinks((prev) => prev.filter((l) => l.id !== id))
      toast.success('Link removido!')
    } catch {
      toast.error('Erro ao remover link')
    }
  }

  async function handleToggle(id: string, active: boolean) {
    try {
      await linkService.update(id, { is_active: active })
      setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, is_active: active } : l)))
    } catch {
      toast.error('Erro ao atualizar link')
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = links.findIndex((l) => l.id === active.id)
    const newIdx = links.findIndex((l) => l.id === over.id)
    const reordered = arrayMove(links, oldIdx, newIdx).map((l, i) => ({ ...l, order_index: i }))
    setLinks(reordered)
    await linkService.reorder(reordered.map((l) => ({ id: l.id, order_index: l.order_index })))
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-black text-2xl text-slate-800 dark:text-white">Meus Links</h1>
        <button
          onClick={() => { setShowForm(true); setEditingLink(null); reset() }}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-4 py-2.5 rounded-2xl text-sm transition-colors"
        >
          <Plus size={16} /> Novo link
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-5 border border-white/60 space-y-3"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-800 dark:text-white">{editingLink ? 'Editar link' : 'Novo link'}</h3>
              <button type="button" onClick={() => { setShowForm(false); setEditingLink(null); reset() }}>
                <X size={16} className="text-slate-400 hover:text-slate-600" />
              </button>
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-600">Título</Label>
              <Input {...register('title')} placeholder="Ex: Instagram" className="mt-1" />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-600">URL</Label>
              <Input {...register('url')} placeholder="https://..." className="mt-1" />
              {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>}
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-600">Ícone (emoji ou nome)</Label>
              <Input {...register('icon')} placeholder="📸 ou instagram" className="mt-1" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                <Check size={14} /> Salvar
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingLink(null); reset() }} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                Cancelar
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            <AnimatePresence>
              {links.map((link) => (
                <SortableLink key={link.id} link={link} onEdit={handleEdit} onDelete={handleDelete} onToggle={handleToggle} />
              ))}
            </AnimatePresence>
            {links.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Link2 size={32} className="mx-auto mb-3 opacity-40" />
                <p className="font-semibold">Nenhum link ainda</p>
                <p className="text-sm">Clique em &quot;Novo link&quot; para começar</p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

function Link2({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}
