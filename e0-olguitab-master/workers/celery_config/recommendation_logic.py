import httpx
from collections import Counter
from celery import shared_task
import asyncio
import redis
import json

# Conexión a Redis
cache = redis.StrictRedis(host='redis-broker', port=6379, db=0, decode_responses=True)

async def get_user_bets(user_id):
    async with httpx.AsyncClient() as client:
        try:
            # Verificar si ya hay datos en caché
            cached_bets = cache.get(f"user_bets_{user_id}")
            if cached_bets:
                return json.loads(cached_bets)

            # Obtener el historial de apuestas del usuario
            response = await client.get(f"https://olguitabarriga.me/api/bet/history/{user_id}")
            response.raise_for_status()
            user_bets = response.json()

            # Filtrar y procesar las apuestas
            valid_bets = [bet for bet in user_bets if bet["result"] != "---"]
            team_names = [bet["league_name"] for bet in valid_bets]
            team_counts = Counter(team_names)
            ordered_teams = [team for team, _ in team_counts.most_common()]

            # Almacenar en caché por 6 horas
            cache.setex(f"user_bets_{user_id}", 21600, json.dumps(ordered_teams))
            return ordered_teams
        except httpx.HTTPStatusError as e:
            print(f"Error al obtener apuestas del usuario: {e}")
            return []
        except Exception as e:
            print(f"Error inesperado: {e}")
            return []

async def get_upcoming_matches():
    try:
        # Verificar si los partidos ya están en caché
        cached_matches = cache.get("upcoming_matches")
        if cached_matches:
            return json.loads(cached_matches)

        async with httpx.AsyncClient() as client:
            response = await client.get("https://olguitabarriga.me/fixtures")
            response.raise_for_status()
            matches = response.json().get('data', [])

            # Almacenar en caché por 1 hora
            cache.setex("upcoming_matches", 3600, json.dumps(matches))
            return matches
    except httpx.HTTPStatusError as e:
        print(f"Error al obtener partidos: {e}")
        return []
    except Exception as e:
        print(f"Error inesperado: {e}")
        return []

async def find_top_recommended_matches(teams):
    all_matches = await get_upcoming_matches()
    recommended_matches = []

    for team in teams:
        for match in all_matches:
            if len(recommended_matches) >= 3:  # Detener al alcanzar 3 recomendaciones
                return recommended_matches

            home_team = match['teams']['home']['name']
            away_team = match['teams']['away']['name']

            if team in (home_team, away_team):
                recommended_matches.append({
                    "fixture_id": match["fixture"]["id"],
                    "recommended_winner": team
                })

    # Si no hay suficientes recomendaciones, agregar más partidos
    if len(recommended_matches) < 3:
        additional_matches = 3 - len(recommended_matches)
        for match in all_matches:
            if len(recommended_matches) >= 3:
                break
            home_team = match['teams']['home']['name']
            recommended_matches.append({
                "fixture_id": match["fixture"]["id"],
                "recommended_winner": home_team
            })

    return recommended_matches

async def generate_recommendations(user_id):
    # Verificar caché para recomendaciones
    cached_recommendations = cache.get(f"user_recommendations_{user_id}")
    if cached_recommendations:
        return json.loads(cached_recommendations)

    # Obtener equipos favoritos del usuario
    teams = await get_user_bets(user_id)

    # Buscar partidos recomendados
    recommendations = await find_top_recommended_matches(teams)

    # Almacenar en caché por 6 horas
    cache.setex(f"user_recommendations_{user_id}", 21600, json.dumps(recommendations))
    return recommendations
